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
import { RevealWorldEventQueue } from "./visibility/reveal-world";
import { RememberWorldEventQueue } from "./visibility/remember-world";
import { LooseFleetEventQueue } from "./combat/loose-fleet";
import { WorldStartGrowingEventQueue } from "./population/world-start-growing";
import { WorldPopulationGrowsEventQueue } from "./population/world-population-grows";
import { WorldStopGrowingEventQueue } from "./population/world-stop-growing";
import { GameEndsEventQueue } from "./scoring/game-ends";
import { PlayerChangesInfluenceEventQueue } from "./scoring/player-changes-influence";
import { NotifyFleetIdleEventQueue } from "./idle-notification/notify-fleet-idle";
import { StartCargoMissionEventQueue } from "./cargo/start-cargo-mission";
import { StopCargoMissionEventQueue } from "./cargo/stop-cargo-mission";
import { BeginTransferingCargoEventQueue } from "./cargo/begin-transfering-cargo";
import { EndTransferingCargoEventQueue } from "./cargo/end-transfering-cargo";
import { FleetSplitsEventQueue } from "./split-fleet/fleet-splits";
import { FleetDeploysToWorldEventQueue } from "./deploy/fleet-deploys-to-world";
import { RevealAllWorldsEventQueue } from "./visibility/reveal-all-worlds";
import { ContinueOrStopBuildingShipEventQueue } from "./building/continue-building-ship";

@injectable()
export class CompleteEventQueue implements GameEventQueue {

  upcomingEvent$: Observable<GameEvent | null>;

  constructor(

    // TODO split into sub-queues

    gameEnds: GameEndsEventQueue,
    playerChangesInfluence: PlayerChangesInfluenceEventQueue,

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

    // startCapturingWorld: StartCapturingWorldEventQueue,
    // captureWorld: CaptureWorldEventQueue,
    // stopCapturingWorld: StopCapturingWorldEventQueue,
    looseFleet: LooseFleetEventQueue,

    startCargoMission: StartCargoMissionEventQueue,
    stopCargoMission: StopCargoMissionEventQueue,
    beginTransferingCargo: BeginTransferingCargoEventQueue,
    endTransferingCargo: EndTransferingCargoEventQueue,

    revealWorld: RevealWorldEventQueue,
    remeberWorld: RememberWorldEventQueue,
    revealAllWorlds: RevealAllWorldsEventQueue,

    notifyFleetIdle: NotifyFleetIdleEventQueue,

    fleetSplits: FleetSplitsEventQueue,
    fleetDeploysToWorld: FleetDeploysToWorldEventQueue
  ) {

    const allEventQueues = [
      revealWorld,
      remeberWorld,
      revealAllWorlds,
      // startCapturingWorld,
      // captureWorld,
      // stopCapturingWorld,
      looseFleet,
      // awaitCapture,
      gameEnds,
      playerChangesInfluence,
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

    this.upcomingEvent$ = combineLatest(
      ...allEventQueues.map(queue => {

        if (!queue.upcomingEvent$) console.log(queue.constructor.name,)

        return queue.upcomingEvent$
      })
    ).pipe(
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