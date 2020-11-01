import { mkdir, readdir, Dirent, readFile, writeFile, exists, rename, unlink } from 'fs';
import { dirname, join } from 'path'
import { injectable } from 'inversify';
import { Environment } from '../environment/environment';
import produce from "immer";
import { ReplaySubject, Observable, Subject, concat, forkJoin, combineLatest } from 'rxjs';
import { take, switchMap, filter, first, map, startWith, distinctUntilChanged } from 'rxjs/operators';
import { Queue } from '../infrastructure/queue/queue';
import { makeId } from '../../app/client/make-id';

@injectable()
export class DataHandleRegistry {

  constructor(private environment: Environment) { }

  private dataHandlesByPath = new Map<string, DataHandle<unknown>>();

  private dataHandleCreated$$ = new ReplaySubject<void>(1);

  public dataHandlesAreBusy$ = this.dataHandleCreated$$.pipe(
    switchMap(() => {
      const handles = [...this.dataHandlesByPath.values()];
      return combineLatest([
        ...handles.map(handle => handle.busy$)
      ]).pipe(map(values => values.some(it => it)))
    }),
    startWith(false),
    distinctUntilChanged()
  )

  async getDataHandle<TData>(path: string): Promise<DataHandle<TData>> {
    if (!this.validateFilePath(path)) {
      throw new Error(`Path '${path}' is invalid.`)
    }
    if (this.dataHandlesByPath.has(path)) {
      return this.dataHandlesByPath.get(path) as DataHandle<TData>
    } else {
      const dataHandle = new DataHandle<TData>(path, this.environment);
      this.dataHandlesByPath.set(path, dataHandle);
      this.dataHandleCreated$$.next();
      await dataHandle.initialize();
      return dataHandle;
    }
  }

  async listDirectories(path: string): Promise<string[]> {
    if (!this.validateDirectoryPath(path)) {
      throw new Error(`Path '${path}' is invalid.`)
    }
    const dir = join(this.environment.dataPath, path);

    await mkdirPromise(dir)

    return (await readdirPromise(dir))
      .filter(dirent => dirent.isDirectory())
      .map(dirent => dirent.name)
  }

  private validateFilePath(path: string) {
    return path.endsWith('.json') && this.validateDirectoryPath(path.slice(0, -5));
  }

  private validateDirectoryPath(path: string) {
    return !!path.match(/^[a-z\d\/\-_]*$/)
  }

}

export type Update<TData> = (data: TData) => void;

export type Transaction<TData> = (data: Readonly<TData>) => Promise<Update<TData>>;

export class DataHandle<TData> {

  private existsForSure = false;

  private queue = new Queue();

  public busy$ = this.queue.running$;

  initialization = new Subject<never>();

  constructor(private path: string, private environment: Environment) {
  }

  public initialize() {
    return this.queue.addJoined(() => this.exists().then(fileExists => {
      if (fileExists) {
        this.existsForSure = true;
        return this.readFileAtFullpath();
      } else {
        return Promise.resolve()
      }
    }).then(() => {
      this.initialization.complete();
    }))
  }

  private async readFileAtFullpath() {
    const data = JSON.parse(await readFilePromise(this.fullpath));
    this._data$.next(data);
  }

  private async writeFileAtFullpath(data: TData) {
    this._data$.next(data);
    await writeFilePromise(this.fullpath, JSON.stringify(data, null, 4));
    this.existsForSure = true;
  }

  private get fullpath() {
    return join(this.environment.dataPath, this.path);
  }

  private _data$ = new ReplaySubject<TData>(1);

  async read() {
    if (!(await this.exists())) {
      throw new Error(`file for data handle '${this.path}' noes not exist`)
    }
    // TODO await asynchronous initialization
    return await this.asObservable().pipe(take(1)).toPromise() as Readonly<TData>;
  }

  public asObservable() {
    // TODO keep track of subscription count in order to free memory
    return concat(this.initialization, this._data$) as Observable<Readonly<TData>>;
  }

  public async do(transaction: Transaction<TData>) {

    if (!(await this.exists())) {
      throw new Error(`file for data handle '${this.path}' noes not exist`)
    }

    await this.queue.addJoined(async () => {

      const data = await this.read()

      const update = await transaction(data);

      await this.writeFileAtFullpath(produce(data, update));
    })
  }

  public async exists() {
    if (this.existsForSure) {
      return true;
    }

    if (await existsPromise(this.fullpath)) {
      this.existsForSure = true;
      return true;
    } else {
      return false;
    }
  }

  public async create(data: TData) {
    if (await this.exists()) {
      throw new Error(`file for data handle '${this.path}' allready exists`)
    }

    await this.queue.addJoined(async () => {

      const dir = dirname(this.fullpath);

      await mkdirPromise(dir)

      await this.writeFileAtFullpath(data);
    })
  }

  public async createIfMissing(data: TData) {
    if (!await this.exists()) {
      await this.create(data);
    }
  }
}

function mkdirPromise(dir: string) {
  return new Promise((resolve, reject) => {
    mkdir(dir, { recursive: true }, (error) => {
      if (error) {
        reject(error)
      } else {
        resolve();
      }
    })
  })
}

function readdirPromise(dir: string): Promise<Dirent[]> {
  return new Promise((resolve, reject) => {
    readdir(dir, { withFileTypes: true }, (error, result) => {
      if (error) {
        reject(error)
      } else {
        resolve(result);
      }
    })
  })
}

function readFilePromise(dir: string): Promise<string> {
  return new Promise((resolve, reject) => {
    readFile(dir, 'utf8', (error, result) => {
      if (error) {
        reject(error)
      } else {
        resolve(result);
      }
    })
  })
}

async function writeFilePromise(dir: string, data: any): Promise<void> {

  const temp = dirname(dir) + '/temp_' +makeId() + '.json'

  await new Promise((resolve, reject) => {
    writeFile(temp, data, 'utf8', (error) => {
      if (error) {
        reject(error)
      } else {
        resolve();
      }
    })
  })

  await new Promise((resolve, reject) => {
    rename(temp, dir, (error) => {
      if (error) {
        reject(error)
      } else {
        resolve();
      }
    })
  })
}

function existsPromise(dir: string): Promise<boolean> {
  return new Promise((resolve, reject) => {
    exists(dir, (result) => {
      resolve(result);
    })
  })
}

