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

export function registerEventQueues(container: Container) {

  container.bind(BeginTransferMetalEventQueue).toSelf();
  container.bind(BeginTransferShipsEventQueue).toSelf();
  container.bind(EndTransferMetalEventQueue).toSelf();
  container.bind(EndTransferShipsEventQueue).toSelf();

  container.bind(ArriveAtWorldEventQueue).toSelf();
  container.bind(BeginWarpEventQueue).toSelf();
  container.bind(EndWarpEventQueue).toSelf();
  container.bind(LeaveWorldEventQueue).toSelf();

  container.bind(CompleteEventQueue).toSelf();

}