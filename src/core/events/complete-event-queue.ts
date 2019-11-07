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
import { BeginBuildingShipEventQueue } from "./build/begin-building-ship";
import { EndBuildShipsEventQueue } from "./build/end-build-ship";
import { BeginBuildingIndustryEventQueue } from "./build/begin-building-industry";
import { EndBuildIndustryEventQueue } from "./build/end-build-industry";
import { FleetFireEventQueue } from "./combat/fleet-fire";
import { FleetStartFiringEventQueue } from "./combat/fleet-start-firing";
import { FleetStopFiringEventQueue } from "./combat/fleet-stop-firing";

@injectable()
export class CompleteEventQueue implements GameEventQueue {

  upcomingEvent$: Observable<GameEvent | null>;

  constructor(
    beginTransferMetal: BeginTransferMetalEventQueue,
    beginTransferShips: BeginTransferShipsEventQueue,
    endTransferMetal: EndTransferMetalEventQueue,
    endTransfertShips: EndTransferShipsEventQueue,
    arriveAtWorld: ArriveAtWorldEventQueue,
    beginWarp: BeginWarpEventQueue,
    endWarp: EndWarpEventQueue,
    leaveWorld: LeaveWorldEventQueue,
    beginBuildShips: BeginBuildingShipEventQueue,
    endBuildShips: EndBuildShipsEventQueue,
    beginBuildIndustry: BeginBuildingIndustryEventQueue,
    endBuildIndustry: EndBuildIndustryEventQueue,
    fleetStartFiring: FleetStartFiringEventQueue,
    fleetFire: FleetFireEventQueue,
    fleetStopFiring: FleetStopFiringEventQueue,
  ) {

    const allEventQueues = [
      beginTransferMetal,
      beginTransferShips,
      endTransferMetal,
      endTransfertShips,
      arriveAtWorld,
      beginWarp,
      endWarp,
      leaveWorld,
      beginBuildShips,
      endBuildShips,
      beginBuildIndustry,
      endBuildIndustry,
      fleetStartFiring,
      fleetFire,
      fleetStopFiring,
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