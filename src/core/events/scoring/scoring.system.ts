import { Container, injectable } from "inversify";
import { combineEventQueues, GameEventQueue } from "../event";
import { GameSystem } from "../game-system";
import { GameEndsEventQueue } from "./game-ends";
import { GameEndsNoScoringEventQueue } from "./game-ends-no-scoring";

export const SCORING_SYSTEM_KEY = "SCORING";
export const NO_SCORING_SYSTEM_KEY = "NO_SCORING";

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

@injectable()
export class NoScoringSystem implements GameSystem {

    constructor(
        private gameEnds: GameEndsNoScoringEventQueue,
    ) {

    }

    key = NO_SCORING_SYSTEM_KEY

    queue: GameEventQueue = {
        upcomingEvent$: combineEventQueues([
            this.gameEnds,
        ])
    }

}

export function registerScoringSystem(container: Container) {
    container.bind(GameEndsEventQueue).toSelf();
    container.bind(ScoringSystem).toSelf();
    container.bind(GameEndsNoScoringEventQueue).toSelf();
    container.bind(NoScoringSystem).toSelf();
}