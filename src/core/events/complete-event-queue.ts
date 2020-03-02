import { injectable } from "inversify";
import { GameEventQueue, GameEvent } from "./event";
import { BeginLoadingMetalEventQueue } from "./transfer/begin-loading-metal";
import { Observable, combineLatest } from "rxjs";
import { map } from "rxjs/operators";
import { BeginLoadingShipsEventQueue } from "./transfer/begin-loading-ships";
import { EndLoadMetalEventQueue } from "./transfer/end-loading-metal";
import { EndLoadingShipsEventQueue } from "./transfer/end-loading-ships";
import { ArriveAtWorldEventQueue } from "./warping/arrive-world";
import { BeginWarpEventQueue } from "./warping/begin-warp";
import { EndWarpEventQueue } from "./warping/end-warp";
import { LeaveWorldEventQueue } from "./warping/leave-world";
import { BeginBuildingShipEventQueue } from "./building/begin-building-ship";
import { EndBuildShipsEventQueue } from "./building/end-build-ship";
import { BeginBuildingIndustryEventQueue } from "./building/begin-building-industry";
import { EndBuildIndustryEventQueue } from "./building/end-build-industry";
import { FleetFireEventQueue } from "./combat/fleet-fire";
import { FleetStartFiringEventQueue } from "./combat/fleet-start-firing";
import { FleetStopFiringEventQueue } from "./combat/fleet-stop-firing";
import { WorldStartFiringEventQueue } from "./combat/world-start-firing";
import { WorldFireEventQueue } from "./combat/world-fire";
import { WorldStopFiringEventQueue } from "./combat/world-stop-firing";
import { CaptureWorldEventQueue } from "./capture/capture-world";
import { CaptureFleetEventQueue } from "./capture/capture-fleet";
import { TickEventQueue } from "./tick";
import { BeginDroppingMetalEventQueue } from "./transfer/begin-dropping-metal";
import { BeginDroppingShipsEventQueue } from "./transfer/begin-dropping-ships";
import { EndDroppingMetalEventQueue } from "./transfer/end-dropping-metal";
import { EndDroppingShipsEventQueue } from "./transfer/end-dropping-ships";

@injectable()
export class CompleteEventQueue implements GameEventQueue {

  upcomingEvent$: Observable<GameEvent | null>;

  constructor(
    beginLoadMetal: BeginLoadingMetalEventQueue,
    beginLoadShips: BeginLoadingShipsEventQueue,
    endLoadMetal: EndLoadMetalEventQueue,
    endLoadShips: EndLoadingShipsEventQueue,
    beginDropMetal: BeginDroppingMetalEventQueue,
    beginDropShips: BeginDroppingShipsEventQueue,
    endDropMetal: EndDroppingMetalEventQueue,
    endDropShips: EndDroppingShipsEventQueue,
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
    worldStartFiring: WorldStartFiringEventQueue,
    worldFire: WorldFireEventQueue,
    worldStopFiring: WorldStopFiringEventQueue,
    captureFleet: CaptureFleetEventQueue,
    captureWorld: CaptureWorldEventQueue,
  ) {

    const allEventQueues = [
      beginLoadMetal,
      beginLoadShips,
      endLoadMetal,
      endLoadShips,
      beginDropMetal,
      beginDropShips,
      endDropShips,
      endDropMetal,
      arriveAtWorld,
      beginWarp,
      endWarp,
      leaveWorld,
      beginBuildShips,
      endBuildShips,
      beginBuildIndustry,
      endBuildIndustry,
      fleetStopFiring,
      fleetStartFiring,
      fleetFire,
      worldStartFiring,
      worldFire,
      worldStopFiring,
      captureFleet,
      captureWorld,
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