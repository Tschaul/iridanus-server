import { Container } from "inversify";
import { CompleteEventQueue } from "./complete-event-queue";
import { ArriveAtWorldEventQueue } from "./warping/arrive-world";
import { BeginWarpEventQueue } from "./warping/begin-warp";
import { EndWarpEventQueue } from "./warping/end-warp";
import { LeaveWorldEventQueue } from "./warping/leave-world";
import { BeginBuildingShipEventQueue } from "./building/begin-building-ship";
import { EndBuildShipsEventQueue } from "./building/end-build-ship";
import { FleetStartFiringEventQueue } from "./combat/fleet-start-firing";
import { FleetFireEventQueue } from "./combat/fleet-fire";
import { FleetStopFiringEventQueue } from "./combat/fleet-stop-firing";
import { CaptureWorldEventQueue } from "./capture/capture-world";
import { TickEventQueue } from "./tick";
import { WorldStartMiningEventQueue } from "./mining/world-start-mining";
import { WorldMinesMetalEventQueue } from "./mining/world-mines-metal";
import { WorldStopMiningEventQueue } from "./mining/world-stop-mining";
import { DiscoverWorldEventQueue } from "./notification/notify-world-discovered";
import { LooseFleetEventQueue } from "./combat/loose-fleet";
import { WorldStartGrowingEventQueue } from "./population/world-start-growing";
import { WorldPopulationGrowsEventQueue } from "./population/world-population-grows";
import { WorldStopGrowingEventQueue } from "./population/world-stop-growing";
import { StartCapturingWorldEventQueue } from "./capture/start-capturing-world";
import { StopCapturingWorldEventQueue } from "./capture/stop-capturing-world";
import { GameEndsEventQueue } from "./scoring/game-ends";
import { GameStartsEventQueue } from "./start/game-starts";
import { NotifyFleetIdleEventQueue } from "./notification/notify-fleet-idle";
import { StartCargoMissionEventQueue } from "./cargo/start-cargo-mission";
import { BeginTransferingCargoEventQueue } from "./cargo/begin-transfering-cargo";
import { StopCargoMissionEventQueue } from "./cargo/stop-cargo-mission";
import { EndTransferingCargoEventQueue } from "./cargo/end-transfering-cargo";
import { FleetSplitsEventQueue } from "./fleet-grouping/fleet-splits";
import { FleetDeploysToWorldEventQueue } from "./deploy/fleet-deploys-to-world";
import { ContinueOrStopBuildingShipEventQueue } from "./building/continue-building-ship";
import { ConvertPopulationEventQueue } from "./capture/convert-population";
import { PlayerGetsDefeatedEventQueue } from "./surrender/player-gets-defeated";
import { PlayerSurrendersEventQueue } from "./surrender/player-surrenders";
import { registerBuildSystem } from "./building/building.system";
import { registerCaptureSystem } from "./capture/capture.system";
import { registerCombatSystem } from "./combat/combat.system";
import { registerCargoSystem } from "./cargo/cargo.system";
import { registerNotifySystem } from "./notification/notification.system";
import { registerMiningSystem } from "./mining/mining.system";
import { registerPopulationSystem } from "./population/population.system";
import { registerSurrenderSystem } from "./surrender/surrender.system";
import { registerFleetGroupingSystem } from "./fleet-grouping/fleet-grouping.system";
import { registerWarpingSystem } from "./warping/warping.system";
import { registerScoringSystem } from "./scoring/scoring.system";
import { registerDeploySystem } from "./deploy/deploy.system";

export function registerEventQueues(container: Container) {

  container.bind(GameStartsEventQueue).toSelf()
  container.bind(TickEventQueue).toSelf();

  registerCargoSystem(container);
  registerSurrenderSystem(container);
  registerWarpingSystem(container);
  registerBuildSystem(container);
  registerCombatSystem(container);
  registerMiningSystem(container);
  registerPopulationSystem(container);
  registerCaptureSystem(container);
  registerNotifySystem(container);
  registerScoringSystem(container);
  registerFleetGroupingSystem(container);
  registerDeploySystem(container);

  container.bind(CompleteEventQueue).toSelf();

}