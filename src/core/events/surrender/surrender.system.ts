import { Container, injectable } from "inversify";
import { combineEventQueues, GameEventQueue } from "../event";
import { GameSystem } from "../game-system";
import { PlayerGetsDefeatedEventQueue } from "./player-gets-defeated";
import { PlayerSurrendersEventQueue } from "./player-surrenders";

export const SURRENDER_SYSTEM_KEY = "SURRENDER";

@injectable()
export class SurrenderSystem implements GameSystem {

    constructor(
        private playerGetsDefeated: PlayerGetsDefeatedEventQueue,
        private playerSurrenders: PlayerSurrendersEventQueue,
    ) {

    }

    key = SURRENDER_SYSTEM_KEY

    queue: GameEventQueue = {
        upcomingEvent$: combineEventQueues([
            this.playerGetsDefeated,
            this.playerSurrenders,
        ])
    }

}

export function registerSurrenderSystem(container: Container) {
    container.bind(PlayerGetsDefeatedEventQueue).toSelf();
    container.bind(PlayerSurrendersEventQueue).toSelf();
    container.bind(SurrenderSystem).toSelf();
}