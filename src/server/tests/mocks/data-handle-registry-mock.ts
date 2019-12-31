import { injectable } from 'inversify';
import produce from "immer";
import { Observable, BehaviorSubject, ReplaySubject } from 'rxjs';
import { take } from 'rxjs/operators';
import { DataHandleRegistry, DataHandle } from '../../repositories/data-handle-registry';

@injectable()
export class DataHandleRegistryMock {

  private dataHandlesByPath = new Map<string, DataHandleMock<unknown>>();

  getDataHandle<TData>(path: string): DataHandleMock<TData> {
    if (this.dataHandlesByPath.has(path)) {
      return this.dataHandlesByPath.get(path) as DataHandleMock<TData>
    } else {
      const dataHandle = new DataHandleMock<TData>(path, (this.initialData.get(path) as TData) || null);
      this.dataHandlesByPath.set(path, dataHandle);
      return dataHandle;
    }
  }

  async listDirectories(path: string): Promise<string[]> {
    return this.directoryLists.get(path) || [];
  }

  public directoryLists = new Map<string, string[]>();
  public initialData = new Map<string, any>();

}

export type Update<TData> = (data: TData) => void;

export type Transaction<TData> = (data: TData) => Promise<Update<TData>>;

export class DataHandleMock<TData> {

  private _data$ = new ReplaySubject<TData>(1);

  private _mockData$ = new BehaviorSubject<TData | null>(null);

  constructor(private path: string, public initilaData: TData | null = null) {}
  
  async read() {
    if (!await this.exists()) {
      throw new Error(`file for data handle '${this.path}' noes not exist`)
    }
    // TODO await asynchronous initialization
    return await this.asObservable().pipe(take(1)).toPromise() as Readonly<TData>;
  }

  public asObservable() {
    return this._mockData$ as Observable<Readonly<TData>>;
  }

  public async do(transaction: Transaction<TData>) {

    if (!await this.exists()) {
      throw new Error(`file for data handle '${this.path}' noes not exist`)
    }

    const data = await this.read()

    const update = await transaction(data);

    this._mockData$.next(produce(data, update));
  }

  public async exists() {
    const data = await this.read()
    return data == null;
  }

  public async create(data: TData) {
    if (await this.exists()) {
      throw new Error(`file for data handle '${this.path}' allready exists`)
    }

    this._mockData$.next(data);
  }

  public async createIfMissing(data: TData) {
    if (!await this.exists()) {
      await this.create(data);
    }
  }
}