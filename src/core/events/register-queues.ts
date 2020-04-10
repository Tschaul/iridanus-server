import { Container } from "inversify";
import { BeginLoadingMetalEventQueue } from "./transfer/begin-loading-metal";
import { CompleteEventQueue } from "./complete-event-queue";
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
import { FleetStartFiringEventQueue } from "./combat/fleet-start-firing";
import { FleetFireEventQueue } from "./combat/fleet-fire";
import { FleetStopFiringEventQueue } from "./combat/fleet-stop-firing";
import { WorldStartFiringEventQueue } from "./combat/world-start-firing";
import { WorldFireEventQueue } from "./combat/world-fire";
import { WorldStopFiringEventQueue } from "./combat/world-stop-firing";
import { CaptureFleetEventQueue } from "./capture/capture-fleet";
import { CaptureWorldEventQueue } from "./capture/capture-world";
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
import { GameStartsEventQueue } from "./start/game-starts";
import { NotifyFleetIdleEventQueue } from "./idle-notification/notify-fleet-idle";
import { NotifyWorldIdleEventQueue } from "./idle-notification/notify-world-idle";

export function registerEventQueues(container: Container) {

  // TODO split into sub registries

  container.bind(GameStartsEventQueue).toSelf()

  container.bind(GameEndsEventQueue).toSelf();
  container.bind(PlayerChangesInfluenceEventQueue).toSelf();

  container.bind(BeginLoadingMetalEventQueue).toSelf();
  container.bind(BeginLoadingShipsEventQueue).toSelf();
  container.bind(BeginLoadingPopulationEventQueue).toSelf();
  container.bind(EndLoadMetalEventQueue).toSelf();
  container.bind(EndLoadingShipsEventQueue).toSelf();
  container.bind(EndLoadPopulationEventQueue).toSelf();

  container.bind(BeginDroppingMetalEventQueue).toSelf();
  container.bind(BeginDroppingShipsEventQueue).toSelf();
  container.bind(BeginDroppingPopulationEventQueue).toSelf();
  container.bind(EndDroppingMetalEventQueue).toSelf();
  container.bind(EndDroppingShipsEventQueue).toSelf();
  container.bind(EndDroppingPopulationEventQueue).toSelf();

  container.bind(BeginScrappingShipsEventQueue).toSelf();
  container.bind(EndScrappingShipsEventQueue).toSelf();

  container.bind(ArriveAtWorldEventQueue).toSelf();
  container.bind(BeginWarpEventQueue).toSelf();
  container.bind(EndWarpEventQueue).toSelf();
  container.bind(LeaveWorldEventQueue).toSelf();

  container.bind(BeginBuildingShipEventQueue).toSelf();
  container.bind(EndBuildShipsEventQueue).toSelf();
  container.bind(BeginBuildingIndustryEventQueue).toSelf();
  container.bind(EndBuildIndustryEventQueue).toSelf();

  container.bind(FleetStartFiringEventQueue).toSelf();
  container.bind(FleetFireEventQueue).toSelf();
  container.bind(FleetStopFiringEventQueue).toSelf();

  container.bind(WorldStartFiringEventQueue).toSelf();
  container.bind(WorldFireEventQueue).toSelf();
  container.bind(WorldStopFiringEventQueue).toSelf();

  container.bind(WorldStartMiningEventQueue).toSelf();
  container.bind(WorldMinesMetalEventQueue).toSelf();
  container.bind(WorldStopMiningEventQueue).toSelf();

  container.bind(WorldStartGrowingEventQueue).toSelf();
  container.bind(WorldPopulationGrowsEventQueue).toSelf();
  container.bind(WorldStopGrowingEventQueue).toSelf();

  container.bind(CaptureFleetEventQueue).toSelf();
  container.bind(StartCapturingWorldEventQueue).toSelf();
  container.bind(CaptureWorldEventQueue).toSelf();
  container.bind(StopCapturingWorldEventQueue).toSelf();
  container.bind(LooseFleetEventQueue).toSelf();
  container.bind(AwaitedCaptureEventQueue).toSelf();

  container.bind(RevealWorldEventQueue).toSelf();
  container.bind(RememberWorldEventQueue).toSelf();

  container.bind(TickEventQueue).toSelf();

  container.bind(NotifyFleetIdleEventQueue).toSelf();
  container.bind(NotifyWorldIdleEventQueue).toSelf();

  container.bind(CompleteEventQueue).toSelf();


}