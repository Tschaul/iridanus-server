import { injectable } from "inversify";
import { ReplaySubject } from "rxjs";
import { RequestMessage } from "../../shared/messages/request-message";
import { ResponseMessage } from "../../shared/messages/response-message";

@injectable()
export class SocketConnection {

  socket: WebSocket;

  private requests$$ = new ReplaySubject<RequestMessage>();
  private responses$$ = new ReplaySubject<ResponseMessage>();

  public responses$ = this.responses$$.asObservable();

  constructor() {
    this.socket = new WebSocket('ws://localhost:8999');

    this.socket.onopen = () => this.initializeSocket();
  }

  private initializeSocket() {
    this.socket.onmessage = (msg) => {
      this.responses$$.next(JSON.parse(msg.data));
    }

    this.requests$$.subscribe(msg => {
      this.socket.send(JSON.stringify(msg));
    })
  }

  public send(msg: RequestMessage) {
    this.requests$$.next(msg);
  }

}