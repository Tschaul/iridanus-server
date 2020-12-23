import { Container, injectable } from "inversify";
import { combineEventQueues, GameEventQueue } from "../event";
import { GameSystem } from "../game-system";
import { NotifyFleetIdleEventQueue } from "./notify-fleet-idle";
import { DiscoverWorldEventQueue } from "./notify-world-discovered";

export const NOTIFY_SYSTEM_KEY = "NOTIFY";

@injectable()
export class NotifySystem implements GameSystem {

    constructor(
        private notifyFleetIdleEventQueue: NotifyFleetIdleEventQueue,
        private discoverWorldEventQueue: DiscoverWorldEventQueue,
    ) {

    }

    key = NOTIFY_SYSTEM_KEY

    queue: GameEventQueue = {
        upcomingEvent$: combineEventQueues([
            this.notifyFleetIdleEventQueue,
            this.discoverWorldEventQueue,
        ])
    }

}

export function registerNotifySystem(container: Container) {
    container.bind(NotifyFleetIdleEventQueue).toSelf();
    container.bind(DiscoverWorldEventQueue).toSelf();
    container.bind(NotifySystem).toSelf();
}