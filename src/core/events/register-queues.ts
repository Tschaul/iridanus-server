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
import { RevealWorldEventQueue } from "./visibility/reveal-world";
import { RememberWorldEventQueue } from "./visibility/remember-world";
import { LooseFleetEventQueue } from "./combat/loose-fleet";
import { WorldStartGrowingEventQueue } from "./population/world-start-growing";
import { WorldPopulationGrowsEventQueue } from "./population/world-population-grows";
import { WorldStopGrowingEventQueue } from "./population/world-stop-growing";
import { StartCapturingWorldEventQueue } from "./capture/start-capturing-world";
import { StopCapturingWorldEventQueue } from "./capture/stop-capturing-world";
import { GameEndsEventQueue } from "./scoring/game-ends";
import { PlayerChangesInfluenceEventQueue } from "./scoring/player-changes-influence";
import { AwaitedCaptureEventQueue } from "./capture/awaited-capture";
import { GameStartsEventQueue } from "./start/game-starts";
import { NotifyFleetIdleEventQueue } from "./idle-notification/notify-fleet-idle";
import { StartCargoMissionEventQueue } from "./cargo/start-cargo-mission";
import { BeginTransferingCargoEventQueue } from "./cargo/begin-transfering-cargo";
import { StopCargoMissionEventQueue } from "./cargo/stop-cargo-mission";
import { EndTransferingCargoEventQueue } from "./cargo/end-transfering-cargo";

export function registerEventQueues(container: Container) {

  // TODO split into sub registries

  container.bind(GameStartsEventQueue).toSelf()

  container.bind(GameEndsEventQueue).toSelf();
  container.bind(PlayerChangesInfluenceEventQueue).toSelf();

  container.bind(ArriveAtWorldEventQueue).toSelf();
  container.bind(BeginWarpEventQueue).toSelf();
  container.bind(EndWarpEventQueue).toSelf();
  container.bind(LeaveWorldEventQueue).toSelf();

  container.bind(BeginBuildingShipEventQueue).toSelf();
  container.bind(EndBuildShipsEventQueue).toSelf();

  container.bind(FleetStartFiringEventQueue).toSelf();
  container.bind(FleetFireEventQueue).toSelf();
  container.bind(FleetStopFiringEventQueue).toSelf();

  container.bind(WorldStartMiningEventQueue).toSelf();
  container.bind(WorldMinesMetalEventQueue).toSelf();
  container.bind(WorldStopMiningEventQueue).toSelf();

  container.bind(WorldStartGrowingEventQueue).toSelf();
  container.bind(WorldPopulationGrowsEventQueue).toSelf();
  container.bind(WorldStopGrowingEventQueue).toSelf();

  container.bind(StartCapturingWorldEventQueue).toSelf();
  container.bind(CaptureWorldEventQueue).toSelf();
  container.bind(StopCapturingWorldEventQueue).toSelf();
  container.bind(LooseFleetEventQueue).toSelf();
  container.bind(AwaitedCaptureEventQueue).toSelf();

  container.bind(RevealWorldEventQueue).toSelf();
  container.bind(RememberWorldEventQueue).toSelf();

  container.bind(TickEventQueue).toSelf();

  container.bind(NotifyFleetIdleEventQueue).toSelf();

  container.bind(StartCargoMissionEventQueue).toSelf();
  container.bind(StopCargoMissionEventQueue).toSelf();
  container.bind(BeginTransferingCargoEventQueue).toSelf();
  container.bind(EndTransferingCargoEventQueue).toSelf();


  container.bind(CompleteEventQueue).toSelf();


}