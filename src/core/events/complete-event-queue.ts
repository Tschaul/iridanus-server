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
import { WorldStartMiningEventQueue } from "./mining/world-start-mining";
import { WorldMinesMetalEventQueue } from "./mining/world-mines-metal";
import { WorldStopMiningEventQueue } from "./mining/world-stop-mining";
import { BeginScrappingShipsEventQueue } from "./scrapping/begin-scrapping-ships";
import { EndScrappingShipsEventQueue } from "./scrapping/end-scrapping-ships";
import { RevealWorldEventQueue } from "./visibility/reveal-world";
import { RememberWorldEventQueue } from "./visibility/remember-world";
import { LooseFleetEventQueue } from "./capture/loose-fleet";
import { WorldStartGrowingEventQueue } from "./population/world-start-growing";
import { WorldPopulationGrowsEventQueue } from "./population/world-population-grows";
import { WorldStopGrowingEventQueue } from "./population/world-stop-mining";
import { BeginLoadingPopulationEventQueue } from "./transfer/begin-loading-population";
import { EndLoadPopulationEventQueue } from "./transfer/end-loading-population";
import { BeginDroppingPopulationEventQueue } from "./transfer/begin-dropping-population";
import { EndDroppingPopulationEventQueue } from "./transfer/end-dropping-population";
import { StartCapturingWorldEventQueue } from "./capture/start-capturing-world";
import { StopCapturingWorldEventQueue } from "./capture/stop-capturing-world";
import { GameEndsEventQueue } from "./scoring/game-ends";
import { PlayerChangesInfluenceEventQueue } from "./scoring/player-changes-influence";
import { AwaitedCaptureEventQueue } from "./capture/awaited-capture";
import { NotifyFleetIdleEventQueue } from "./idle-notification/notify-fleet-idle";
import { NotifyWorldIdleEventQueue } from "./idle-notification/notify-world-idle";

@injectable()
export class CompleteEventQueue implements GameEventQueue {

  upcomingEvent$: Observable<GameEvent | null>;

  constructor(

    // TODO split into sub-queues

    gameEnds: GameEndsEventQueue,
    playerChangesInfluence: PlayerChangesInfluenceEventQueue,

    beginLoadMetal: BeginLoadingMetalEventQueue,
    beginLoadShips: BeginLoadingShipsEventQueue,
    beginLoadPopulation: BeginLoadingPopulationEventQueue,
    endLoadMetal: EndLoadMetalEventQueue,
    endLoadShips: EndLoadingShipsEventQueue,
    endLoadPopulation: EndLoadPopulationEventQueue,
    beginDropMetal: BeginDroppingMetalEventQueue,
    beginDropShips: BeginDroppingShipsEventQueue,
    beginDropPopulation: BeginDroppingPopulationEventQueue,
    endDropMetal: EndDroppingMetalEventQueue,
    endDropShips: EndDroppingShipsEventQueue,
    endDropPopulation: EndDroppingPopulationEventQueue,

    arriveAtWorld: ArriveAtWorldEventQueue,
    beginWarp: BeginWarpEventQueue,
    endWarp: EndWarpEventQueue,
    leaveWorld: LeaveWorldEventQueue,

    beginBuildShips: BeginBuildingShipEventQueue,
    endBuildShips: EndBuildShipsEventQueue,
    beginBuildIndustry: BeginBuildingIndustryEventQueue,
    endBuildIndustry: EndBuildIndustryEventQueue,

    beginScrappingShips: BeginScrappingShipsEventQueue,
    endScrappingShips: EndScrappingShipsEventQueue,

    fleetStartFiring: FleetStartFiringEventQueue,
    fleetFire: FleetFireEventQueue,
    fleetStopFiring: FleetStopFiringEventQueue,

    worldStartFiring: WorldStartFiringEventQueue,
    worldFire: WorldFireEventQueue,
    worldStopFiring: WorldStopFiringEventQueue,

    worldStartMining: WorldStartMiningEventQueue,
    worldMinesMetal: WorldMinesMetalEventQueue,
    worldStopMining: WorldStopMiningEventQueue,

    worldStartGrowing: WorldStartGrowingEventQueue,
    worldGrows: WorldPopulationGrowsEventQueue,
    worldStopsGrowing: WorldStopGrowingEventQueue,

    captureFleet: CaptureFleetEventQueue,
    startCapturingWorld: StartCapturingWorldEventQueue,
    captureWorld: CaptureWorldEventQueue,
    stopCapturingWorld: StopCapturingWorldEventQueue,
    looseFleet: LooseFleetEventQueue,
    awaitCapture: AwaitedCaptureEventQueue,

    revealWorld: RevealWorldEventQueue,
    remeberWorld: RememberWorldEventQueue,

    notifyFleetIdle: NotifyFleetIdleEventQueue,
    notifyWorldIdle: NotifyWorldIdleEventQueue,
  ) {

    const allEventQueues = [
      revealWorld,
      remeberWorld,
      captureFleet,
      startCapturingWorld,
      captureWorld,
      stopCapturingWorld,
      looseFleet,
      awaitCapture,
      gameEnds,
      playerChangesInfluence,
      beginLoadMetal,
      beginLoadShips,
      endLoadMetal,
      endLoadShips,
      beginDropMetal,
      beginDropShips,
      endDropShips,
      endDropMetal,
      beginLoadPopulation,
      beginDropPopulation,
      endLoadPopulation,
      endDropPopulation,
      beginScrappingShips,
      endScrappingShips,
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
      worldStartMining,
      worldMinesMetal,
      worldStopMining,
      worldStartGrowing,
      worldStopsGrowing,
      worldGrows,
      notifyFleetIdle,
      notifyWorldIdle
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