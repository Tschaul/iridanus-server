import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs'
import { dirname, join } from 'path'
import { injectable } from 'inversify';
import { Environment } from '../environment/environment';
import produce from "immer";

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

}

export type Update<TData> = (data: TData) => void;

export type Transaction<TData> = (data: TData) => Promise<Update<TData>>;

export class DataHandle<TData> {

  constructor(private path: string, private environment: Environment) {
    // TODO dont block thread while reading
    this.exists().then(fileExists => {
      if (fileExists) {
        this._data = JSON.parse(readFileSync(this.fullpath, 'utf8'));
      }
    })
  }

  private _data: TData;

  async read() {
    // TODO await asynchronous initialization
    return this._data as Readonly<TData>;
  }

  async do(transaction: Transaction<TData>) {

    if (await this.exists()) {
      throw new Error(`file for data handle '${this.path}' noes not exist`)
    }

    // TODO asynchronously lock data object
    const update = await transaction(this._data);

    this._data = produce(this._data, update);

    // TODO dont block thread while writing
    writeFileSync(this.fullpath, JSON.stringify(this._data, null, 4), 'utf8');

    // TODO release lock
  }

  private get fullpath() {
    return join(this.environment.dataPath, this.path);
  }

  async exists() {
    // TODO dont block thread
    return existsSync(this.fullpath);
  }

  async create(data: TData) {
    if (await this.exists()) {
      throw new Error(`file for data handle '${this.path}' allready exists`)
    }

    this._data = data;

    const dir = dirname(this.fullpath);

    // TODO dont block thread while creating directory
    mkdirSync(dir, { recursive: true })

    // TODO dont block thread while writing
    writeFileSync(this.fullpath, JSON.stringify(this._data, null, 4), 'utf8');

  }

  async createIfMissing(data: TData) {
    // TODO lock here
    if (!await this.exists()) {
      await this.create(data);
    }
    // TODO release here
  }
}