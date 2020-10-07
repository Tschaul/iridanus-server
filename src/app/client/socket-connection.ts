import { injectable } from "inversify";
import { ReplaySubject, Observable } from "rxjs";
import { RequestMessage } from "../../shared/messages/request-message";
import { ResponseMessage, SubscriptionResponse } from "../../shared/messages/response-message";
import { filter, take, map } from "rxjs/operators";
import { makeId } from "./make-id";
import { Command } from "../../shared/messages/commands/commands";
import { response } from "express";
import { Credentials } from "../../shared/messages/credentials";

@injectable()
export class SocketConnection {

  socket: WebSocket;

  private requests$$ = new ReplaySubject<RequestMessage>();
  private responses$$ = new ReplaySubject<ResponseMessage>(1);
  private isConnected$$ = new ReplaySubject<boolean>(1);

  public responses$ = this.responses$$.asObservable();
  public isConnected$ = this.isConnected$$.asObservable();

  constructor() {

    const wsProtocol = location.protocol === 'https:' ? 'wss' : 'ws'

    this.socket = new WebSocket(wsProtocol + "://" + location.host);

    this.socket.onopen = () => this.initializeSocket();
    this.socket.onclose = () => this.isConnected$$.next(false);
  }

  private initializeSocket() {
    this.isConnected$$.next(true);
    this.socket.onmessage = (msg) => {
      this.responses$$.next(JSON.parse(msg.data));
    }

    this.requests$$.subscribe(msg => {
      this.socket.send(JSON.stringify(msg));
    })
  }

  private send(msg: RequestMessage) {
    this.requests$$.next(msg);
  }

  public authenticate(userId: string, credentials: Credentials): Promise<string | undefined> {
    const requestId = makeId();
    this.send({
      type: 'AUTHENTICATE',
      userId,
      credentials,
      requestId
    })
    return new Promise((resolve, reject) => {
      this.responses$.pipe(
        filter(response =>
          (response.type === 'AUTHENTICATION_SUCCESSFULL' || response.type === 'AUTHENTICATION_NOT_SUCCESSFULL')
          && response.requestId === requestId
        ),
        take(1)
      ).subscribe(response => {
        if (response.type === 'AUTHENTICATION_SUCCESSFULL') {
          resolve(response.token);
        } else {
          reject('Authentication was not successfull');
        }
      }
      )
    })
  }

  public sendCommand(command: Command, gameId?: string): Promise<void> {
    const commandId = makeId();
    this.send({
      type: 'COMMAND',
      command,
      commandId,
      gameId
    })
    return new Promise((resolve, reject) => {
      this.responses$.pipe(
        filter(response => 'commandId' in response && response.commandId === commandId),
        take(1)
      ).subscribe(response => {
        if (response.type === 'COMMAND_SUCCESS') {
          resolve();
        } else {
          const error = response.type === 'ERROR' ? response.error : 'command id was missused'
          reject(error);
        }
      }
      )
    })
  }

  public subscribe<TSubscriptionResponse, TSubscriptionResult>(subscription: TSubscriptionResponse, gameId: string | null = null): Observable<TSubscriptionResult> {

    return Observable.create((observer: any) => {
      const subscriptionId = makeId(12);
      this.send({
        type: 'BEGIN_SUBSCRIPTION',
        subscription: subscription as any,
        id: subscriptionId,
        gameId,
      });
      const sub = this.responses$$.pipe(
        filter(response => {
          return response.type === 'SUBSCRIPTION_RESULT' && response.id === subscriptionId
        }),
        map((response: SubscriptionResponse) => response.result)
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

