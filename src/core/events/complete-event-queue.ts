import { injectable } from "inversify";
import 'reflect-metadata'
import { GameEventQueue, GameEvent } from "./event";
import { BeginTransferMetalEventQueue } from "./transfer/begin-transfer-metal";
import { Observable, combineLatest } from "rxjs";
import { map } from "rxjs/operators";
import { BeginTransferShipsEventQueue } from "./transfer/begin-transfer-ships";
import { EndTransferMetalEventQueue } from "./transfer/end-transfer-metal";
import { EndTransferShipsEventQueue } from "./transfer/end-transfer-ships";
import { ArriveAtWorldEventQueue } from "./warping/arrive-world";
import { BeginWarpEventQueue } from "./warping/begin-warp";
import { EndWarpEventQueue } from "./warping/end-warp";
import { LeaveWorldEventQueue } from "./warping/leave-world";

@injectable()
export class CompleteEventQueue implements GameEventQueue {

  upcomingEvent$: Observable<GameEvent | null>;

  constructor(
    beginTransferMetal: BeginTransferMetalEventQueue,
    beginTransferShips: BeginTransferShipsEventQueue,
    endTransferMetal: EndTransferMetalEventQueue,
    endTransfertShips: EndTransferShipsEventQueue,
    arriveAtWorldEventQueue: ArriveAtWorldEventQueue,
    beginWarpEventQueue: BeginWarpEventQueue,
    endWarpEventQueue: EndWarpEventQueue,
    leaveWorldEventQueue: LeaveWorldEventQueue,
  ) {

    const allEventQueues = [
      beginTransferMetal,
      beginTransferShips,
      endTransferMetal,
      endTransfertShips,
      arriveAtWorldEventQueue,
      beginWarpEventQueue,
      endWarpEventQueue,
      leaveWorldEventQueue,
    ]

    this.upcomingEvent$ = combineLatest(
      ...allEventQueues.map(queue => queue.upcomingEvent$)
    ).pipe(
      map((events) => {
        return events.reduce((acc, event) => {
          if (event === null) {
            return acc;
          } else if (acc === null) {
            return event;
          } else if (event.timestamp < acc.timestamp) {
            return event;
          } else {
            return acc;
          }
        }, null as GameEvent | null)
      }),
    )
  }
}