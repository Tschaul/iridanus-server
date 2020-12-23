import { Container, injectable } from "inversify";
import { combineEventQueues, GameEventQueue } from "../event";
import { GameSystem } from "../game-system";
import { ArriveAtWorldEventQueue } from "./arrive-world";
import { BeginWarpEventQueue } from "./begin-warp";
import { EndWarpEventQueue } from "./end-warp";
import { LeaveWorldEventQueue } from "./leave-world";

export const WARPING_SYSTEM_KEY = "WARPING";

@injectable()
export class WarpingSystem implements GameSystem {

    constructor(
        private arriveAtWorld: ArriveAtWorldEventQueue,
        private beginWarp: BeginWarpEventQueue,
        private endWarp: EndWarpEventQueue,
        private leaveWorld: LeaveWorldEventQueue,
    ) {

    }

    key = WARPING_SYSTEM_KEY

    queue: GameEventQueue = {
        upcomingEvent$: combineEventQueues([
            this.arriveAtWorld,
            this.beginWarp,
            this.endWarp,
            this.leaveWorld,
        ])
    }

}

export function registerWarpingSystem(container: Container) {
    container.bind(ArriveAtWorldEventQueue).toSelf();
    container.bind(BeginWarpEventQueue).toSelf();
    container.bind(EndWarpEventQueue).toSelf();
    container.bind(LeaveWorldEventQueue).toSelf();
    container.bind(WarpingSystem).toSelf();
}