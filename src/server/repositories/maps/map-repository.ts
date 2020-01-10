import { injectable } from "inversify";
import { DataHandleRegistry } from "../data-handle-registry";
import { ReplaySubject, Observable } from "rxjs";
import { MapSchema } from "./schema/v1";
import { take } from "rxjs/operators";
import { Initializer } from "../../commands/infrastructure/initialisation/initializer";

const BASE_FOLDER = 'maps'

const pathById = (mapId: string) => `${BASE_FOLDER}/${mapId}/map.json`;

@injectable()
export class MapRepository {

  private _data$ = new ReplaySubject<MapSchema[]>(1);

  constructor(private dataHandleRegistry: DataHandleRegistry, initializer: Initializer) {
    initializer.requestInitialization(this.initialize());
  }

  private async initialize() {
    const mapIds = await this.dataHandleRegistry.listDirectories(BASE_FOLDER);

    const data = [] as MapSchema[];

    for (const mapId of mapIds) {
      const handle = await this.handleForMapId(mapId);
      const map = await handle.read();
      data.push(map);
    }

    this._data$.next(data);
  }

  private handleForMapId(mapId: string) {
    return this.dataHandleRegistry.getDataHandle<MapSchema>(pathById(mapId));
  }

  public getAllMap() {
    return this._data$.pipe(take(1)).toPromise();
  }

  public allMapAsObservable() {
    return this._data$ as Observable<Readonly<MapSchema[]>>;
  }

  public async getMapById(mapId: string) {
    const handle = await this.handleForMapId(mapId);
    const data = await handle.read();
    return data.map;
  }
}