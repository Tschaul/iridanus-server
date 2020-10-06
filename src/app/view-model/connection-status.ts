import { SocketConnection } from "../client/socket-connection";
import { resolveFromRegistry } from "../container-registry";
import { IStreamListener, fromStream } from "mobx-utils";
import { EMPTY } from "rxjs";
import { observable, computed } from "mobx";

export class ConnectionStatus {
  private connection = resolveFromRegistry(SocketConnection);

  @observable private status: IStreamListener<boolean> = fromStream(EMPTY, false);
  
  constructor() {
    this.status = fromStream(this.connection.isConnected$, false);
  }

  @computed get isConnected() {
    return this.status.current;
  }
}