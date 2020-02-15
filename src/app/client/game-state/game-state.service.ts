import { SocketConnection } from "../socket-connection";
import { injectable } from "inversify";

@injectable()
export class LobbyService {

  constructor(private connection: SocketConnection) {}
  
}