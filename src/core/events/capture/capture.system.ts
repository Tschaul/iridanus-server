import { Container, injectable } from "inversify";
import { combineEventQueues, GameEventQueue } from "../event";
import { GameSystem } from "../game-system";
import { CaptureWorldEventQueue } from "./capture-world";
import { ConvertPopulationEventQueue } from "./convert-population";
import { StartCapturingWorldEventQueue } from "./start-capturing-world";
import { StopCapturingWorldEventQueue } from "./stop-capturing-world";

export const CAPTURE_SYSTEM_KEY = "CAPTURE";

@injectable()
export class CaptureSystem implements GameSystem {

    constructor(
        private startCapturingWorld: StartCapturingWorldEventQueue,
        private captureWorld: CaptureWorldEventQueue,
        private stopCapturingWorld: StopCapturingWorldEventQueue,
        private convertPopulation: ConvertPopulationEventQueue,
    ) {

    }

    key = CAPTURE_SYSTEM_KEY

    queue: GameEventQueue = {
        upcomingEvent$: combineEventQueues([
            this.startCapturingWorld,
            this.captureWorld,
            this.stopCapturingWorld,
            this.convertPopulation,
        ])
    }

}

export function registerCaptureSystem(container: Container) {
    container.bind(StartCapturingWorldEventQueue).toSelf();
    container.bind(CaptureWorldEventQueue).toSelf();
    container.bind(StopCapturingWorldEventQueue).toSelf();
    container.bind(ConvertPopulationEventQueue).toSelf();
    container.bind(CaptureSystem).toSelf();
}