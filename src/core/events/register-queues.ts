import { Container } from "inversify";
import { BeginTransferMetalEventQueue } from "./transfer/begin-transfer-metal";
import { CompleteEventQueue } from "./complete-event-queue";
import { BeginTransferShipsEventQueue } from "./transfer/begin-transfer-ships";
import { EndTransferMetalEventQueue } from "./transfer/end-transfer-metal";
import { EndTransferShipsEventQueue } from "./transfer/end-transfer-ships";
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

export function registerEventQueues(container: Container) {

  container.bind(BeginTransferMetalEventQueue).toSelf();
  container.bind(BeginTransferShipsEventQueue).toSelf();
  container.bind(EndTransferMetalEventQueue).toSelf();
  container.bind(EndTransferShipsEventQueue).toSelf();

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

  container.bind(CompleteEventQueue).toSelf();

}