import { readFileSync, writeFileSync, existsSync, mkdirSync, readdirSync } from 'fs'
import { dirname, join } from 'path'
import { injectable } from 'inversify';
import { Environment } from '../environment/environment';
import produce from "immer";
import { ReplaySubject, Observable } from 'rxjs';
import { take } from 'rxjs/operators';

@injectable()
export class DataHandleRegistry {

  constructor(private environment: Environment) { }

  private dataHandlesByPath = new Map<string, DataHandle<unknown>>();

  getDataHandle<TData>(path: string): DataHandle<TData> {
    if (this.dataHandlesByPath.has(path)) {
      return this.dataHandlesByPath.get(path) as DataHandle<TData>
    } else {
      const dataHandle = new DataHandle<TData>(path, this.environment);
      this.dataHandlesByPath.set(path, dataHandle);
      return dataHandle;
    }
  }

  async listDirectories(path: string): Promise<string[]> {
    const dir = join(this.environment.dataPath, path);
    // TODO dont block thread while creating directory
    mkdirSync(dir, { recursive: true })
    // TODO dont block thread while reading folder list
    return readdirSync(dir, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory())
      .map(dirent => dirent.name)
  }

}

export type Update<TData> = (data: TData) => void;

export type Transaction<TData> = (data: TData) => Promise<Update<TData>>;

export class DataHandle<TData> {

  existsForSure = false;

  constructor(private path: string, private environment: Environment) {
    this.exists().then(fileExists => {
      if (fileExists) {
        this.existsForSure = true;
        return this.readFileAtFullpath();
      }
    })
  }

  private async readFileAtFullpath() {
    // TODO lock object
    // TODO dont block thread while reading
    this._data$.next(JSON.parse(readFileSync(this.fullpath, 'utf8')));
    // TODO release lock
  }

  private async writeFileAtFullpath(data: TData) {
    // TODO dont block thread while writing
    this._data$.next(data);
    writeFileSync(this.fullpath, JSON.stringify(data, null, 4), 'utf8');
  }

  private get fullpath() {
    return join(this.environment.dataPath, this.path);
  }

  private _data$ = new ReplaySubject<TData>(1);

  async read() {
    if (!await this.exists()) {
      throw new Error(`file for data handle '${this.path}' noes not exist`)
    }
    // TODO await asynchronous initialization
    return await this.asObservable().pipe(take(1)).toPromise() as Readonly<TData>;
  }

  public asObservable() {
    // TODO keep track of subscription count in order to free memory
    return this._data$ as Observable<Readonly<TData>>;
  }

  public async do(transaction: Transaction<TData>) {

    if (!await this.exists()) {
      throw new Error(`file for data handle '${this.path}' noes not exist`)
    }

    // TODO asynchronously lock data object

    const data = await this.read()

    const update = await transaction(data);

    await this.writeFileAtFullpath(produce(data, update));

    // TODO release lock
  }

  public async exists() {
    if (this.existsForSure) {
      return true;
    }

    // TODO dont block thread
    if (existsSync(this.fullpath)) {
      this.existsForSure = true;
    } else {
      return false;
    }
  }

  public async create(data: TData) {
    if (await this.exists()) {
      throw new Error(`file for data handle '${this.path}' allready exists`)
    }

    const dir = dirname(this.fullpath);

    // TODO dont block thread while creating directory
    mkdirSync(dir, { recursive: true })

    await this.writeFileAtFullpath(data);

  }

  public async createIfMissing(data: TData) {
    // TODO lock here
    if (!await this.exists()) {
      await this.create(data);
    }
    // TODO release here
  }
}