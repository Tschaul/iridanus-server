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

  async getDataHandle<TData>(path: string): Promise<DataHandle<TData>> {
    if (!this.validateFilePath(path)) {
      throw new Error(`Path '${path}' is invalid.`)
    }
    if (this.dataHandlesByPath.has(path)) {
      return this.dataHandlesByPath.get(path) as DataHandle<TData>
    } else {
      const dataHandle = new DataHandle<TData>(path, this.environment);
      this.dataHandlesByPath.set(path, dataHandle);
      await dataHandle.initialize();
      return dataHandle;
    }
  }

  async listDirectories(path: string): Promise<string[]> {
    if (!this.validateDirectoryPath(path)) {
      throw new Error(`Path '${path}' is invalid.`)
    }
    const dir = join(this.environment.dataPath, path);
    // TODO dont block thread while creating directory
    mkdirSync(dir, { recursive: true })
    // TODO dont block thread while reading folder list
    return readdirSync(dir, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory())
      .map(dirent => dirent.name)
  }

  private validateFilePath(path: string) {
    return path.endsWith('.json') && this.validateDirectoryPath(path.slice(0,-5));
  }

  private validateDirectoryPath(path: string) {
    return !!path.match(/^[a-z\d\/\-]*$/)
  }

}

export type Update<TData> = (data: TData) => void;

export type Transaction<TData> = (data: TData) => Promise<Update<TData>>;

export class DataHandle<TData> {

  existsForSure = false;

  constructor(private path: string, private environment: Environment) {
  }

  public initialize() {
    // Lock object
    return this.exists().then(fileExists => {
      if (fileExists) {
        this.existsForSure = true;
        return this.readFileAtFullpath();
      }
    });
    // Release object
  }

  private async readFileAtFullpath() {
    // TODO dont block thread while reading
    this._data$.next(JSON.parse(readFileSync(this.fullpath, 'utf8')));
  }

  private async writeFileAtFullpath(data: TData) {
    // TODO dont block thread while writing
    this._data$.next(data);
    writeFileSync(this.fullpath, JSON.stringify(data, null, 4), 'utf8');
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
    return this._data$ as Observable<Readonly<TData>>;
  }

  public async do(transaction: Transaction<TData>) {

    if (!(await this.exists())) {
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
    // TODO lock here
    if (await this.exists()) {
      throw new Error(`file for data handle '${this.path}' allready exists`)
    }

    const dir = dirname(this.fullpath);

    // TODO dont block thread while creating directory
    mkdirSync(dir, { recursive: true })

    await this.writeFileAtFullpath(data);
    // TODO release here
  }

  public async createIfMissing(data: TData) {
    if (!await this.exists()) {
      await this.create(data);
    }
  }
}