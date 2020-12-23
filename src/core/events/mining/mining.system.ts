import { Container, injectable } from "inversify";
import { combineEventQueues, GameEventQueue } from "../event";
import { GameSystem } from "../game-system";
import { WorldMinesMetalEventQueue } from "./world-mines-metal";
import { WorldStartMiningEventQueue } from "./world-start-mining";
import { WorldStopMiningEventQueue } from "./world-stop-mining";

export const MINING_SYSTEM_KEY = "MINING";

@injectable()
export class MiningSystem implements GameSystem {

    constructor(
        private worldStartMining: WorldStartMiningEventQueue,
        private worldMinesMetal: WorldMinesMetalEventQueue,
        private worldStopMining: WorldStopMiningEventQueue,
    ) {

    }

    key = MINING_SYSTEM_KEY

    queue: GameEventQueue = {
        upcomingEvent$: combineEventQueues([
            this.worldStartMining,
            this.worldMinesMetal,
            this.worldStopMining
        ])
    }

}

export function registerMiningSystem(container: Container) {
    container.bind(WorldStartMiningEventQueue).toSelf();
    container.bind(WorldMinesMetalEventQueue).toSelf();
    container.bind(WorldStopMiningEventQueue).toSelf();
    container.bind(MiningSystem).toSelf();
}