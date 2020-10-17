import { injectable } from "inversify";
import { GameEventQueue, GameEvent } from "./event";
import { Observable, combineLatest } from "rxjs";
import { map } from "rxjs/operators";
import { ArriveAtWorldEventQueue } from "./warping/arrive-world";
import { BeginWarpEventQueue } from "./warping/begin-warp";
import { EndWarpEventQueue } from "./warping/end-warp";
import { LeaveWorldEventQueue } from "./warping/leave-world";
import { BeginBuildingShipEventQueue } from "./building/begin-building-ship";
import { EndBuildShipsEventQueue } from "./building/end-build-ship";
import { FleetFireEventQueue } from "./combat/fleet-fire";
import { FleetStartFiringEventQueue } from "./combat/fleet-start-firing";
import { FleetStopFiringEventQueue } from "./combat/fleet-stop-firing";
import { WorldStartMiningEventQueue } from "./mining/world-start-mining";
import { WorldMinesMetalEventQueue } from "./mining/world-mines-metal";
import { WorldStopMiningEventQueue } from "./mining/world-stop-mining";
import { DiscoverWorldEventQueue } from "./discover-notification/notify-world-discovered";
import { LooseFleetEventQueue } from "./combat/loose-fleet";
import { WorldStartGrowingEventQueue } from "./population/world-start-growing";
import { WorldPopulationGrowsEventQueue } from "./population/world-population-grows";
import { WorldStopGrowingEventQueue } from "./population/world-stop-growing";
import { GameEndsEventQueue } from "./scoring/game-ends";
import { NotifyFleetIdleEventQueue } from "./idle-notification/notify-fleet-idle";
import { StartCargoMissionEventQueue } from "./cargo/start-cargo-mission";
import { StopCargoMissionEventQueue } from "./cargo/stop-cargo-mission";
import { BeginTransferingCargoEventQueue } from "./cargo/begin-transfering-cargo";
import { EndTransferingCargoEventQueue } from "./cargo/end-transfering-cargo";
import { FleetSplitsEventQueue } from "./split-fleet/fleet-splits";
import { FleetDeploysToWorldEventQueue } from "./deploy/fleet-deploys-to-world";
import { ContinueOrStopBuildingShipEventQueue } from "./building/continue-building-ship";
import { StartCapturingWorldEventQueue } from "./capture/start-capturing-world";
import { CaptureWorldEventQueue } from "./capture/capture-world";
import { StopCapturingWorldEventQueue } from "./capture/stop-capturing-world";
import { ConvertPopulationEventQueue } from "./capture/convert-population";

@injectable()
export class CompleteEventQueue implements GameEventQueue {

  upcomingEvent$: Observable<GameEvent | null>;

  constructor(

    // TODO split into sub-queues

    gameEnds: GameEndsEventQueue,

    arriveAtWorld: ArriveAtWorldEventQueue,
    beginWarp: BeginWarpEventQueue,
    endWarp: EndWarpEventQueue,
    leaveWorld: LeaveWorldEventQueue,

    beginBuildShips: BeginBuildingShipEventQueue,
    endBuildShips: EndBuildShipsEventQueue,
    continueOrStopBuildShips: ContinueOrStopBuildingShipEventQueue,

    fleetStartFiring: FleetStartFiringEventQueue,
    fleetFire: FleetFireEventQueue,
    fleetStopFiring: FleetStopFiringEventQueue,

    worldStartMining: WorldStartMiningEventQueue,
    worldMinesMetal: WorldMinesMetalEventQueue,
    worldStopMining: WorldStopMiningEventQueue,

    worldStartGrowing: WorldStartGrowingEventQueue,
    worldGrows: WorldPopulationGrowsEventQueue,
    worldStopsGrowing: WorldStopGrowingEventQueue,

    startCapturingWorld: StartCapturingWorldEventQueue,
    captureWorld: CaptureWorldEventQueue,
    stopCapturingWorld: StopCapturingWorldEventQueue,
    convertPopulation: ConvertPopulationEventQueue,

    looseFleet: LooseFleetEventQueue,

    startCargoMission: StartCargoMissionEventQueue,
    stopCargoMission: StopCargoMissionEventQueue,
    beginTransferingCargo: BeginTransferingCargoEventQueue,
    endTransferingCargo: EndTransferingCargoEventQueue,

    revealWorld: DiscoverWorldEventQueue,

    notifyFleetIdle: NotifyFleetIdleEventQueue,

    fleetSplits: FleetSplitsEventQueue,
    fleetDeploysToWorld: FleetDeploysToWorldEventQueue
  ) {

    const allEventQueues = [
      revealWorld,
      startCapturingWorld,
      captureWorld,
      stopCapturingWorld,
      convertPopulation,
      looseFleet,
      // awaitCapture,
      gameEnds,
      arriveAtWorld,
      beginWarp,
      endWarp,
      leaveWorld,
      continueOrStopBuildShips,
      beginBuildShips,
      endBuildShips,
      fleetStopFiring,
      fleetStartFiring,
      fleetFire,
      worldStartMining,
      worldMinesMetal,
      worldStopMining,
      worldStartGrowing,
      worldStopsGrowing,
      worldGrows,
      startCargoMission,
      beginTransferingCargo,
      endTransferingCargo,
      stopCargoMission,
      notifyFleetIdle,
      fleetSplits,
      fleetDeploysToWorld
    ]

    this.upcomingEvent$ = combineLatest([
      ...allEventQueues.map(queue => {

        if (!queue.upcomingEvent$) console.log(queue.constructor.name,)

        return queue.upcomingEvent$
      })
    ]).pipe(
      map((events) => {
        return events.reduce((acc, event) => {
          if (event === null) {
            return acc;
          } else if (acc === null) {
            return event;
          } else if (acc.timestamp && !event.timestamp) {
            return event;
          } else if (acc.timestamp && event.timestamp && event.timestamp < acc.timestamp) {
            return event;
          } else {
            return acc;
          }
        }, null as GameEvent | null)
      }),
    )
  }
}