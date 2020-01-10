import { injectable } from "inversify";
import { ReplaySubject, Observable } from "rxjs";
import { RequestMessage } from "../../shared/messages/request-message";
import { ResponseMessage, SubscriptionResponse } from "../../shared/messages/response-message";
import { filter } from "rxjs/operators";

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

  public subscribe<TSubscriptionResponse, TSubscriptionResult>(subscription: TSubscriptionResponse): Observable<TSubscriptionResult> {

    return Observable.create((observer: any) => {
      const subscriptionId = makeId(12);
      this.send(subscription as any);
      const sub = this.responses$$.pipe(
        filter(response => {
          return response.type === 'SUBSCRIPTION_RESULT' && response.id === subscriptionId
        }),
      ).subscribe(observer);
      return () => {
        this.send({
          type: 'END_SUBSCRIPTION',
          id: subscriptionId
        })
        sub.unsubscribe();
      }
    });
  }

}

function makeId(length: number) {
  var result = '';
  var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}