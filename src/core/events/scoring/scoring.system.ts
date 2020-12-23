import { Container, injectable } from "inversify";
import { combineEventQueues, GameEventQueue } from "../event";
import { GameSystem } from "../game-system";
import { GameEndsEventQueue } from "./game-ends";

export const SCORING_SYSTEM_KEY = "SCORING";

@injectable()
export class ScoringSystem implements GameSystem {

    constructor(
        private gameEnds: GameEndsEventQueue,
    ) {

    }

    key = SCORING_SYSTEM_KEY

    queue: GameEventQueue = {
        upcomingEvent$: combineEventQueues([
            this.gameEnds,
        ])
    }

}

export function registerScoringSystem(container: Container) {
    container.bind(GameEndsEventQueue).toSelf();
    container.bind(ScoringSystem).toSelf();
}