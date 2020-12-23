import { Container, injectable } from "inversify";
import { combineEventQueues, GameEventQueue } from "../event";
import { GameSystem } from "../game-system";
import { WorldPopulationGrowsEventQueue } from "./world-population-grows";
import { WorldStartGrowingEventQueue } from "./world-start-growing";
import { WorldStopGrowingEventQueue } from "./world-stop-growing";

export const POPULATION_SYSTEM_KEY = "POPLUATION";

@injectable()
export class PopulationSystem implements GameSystem {

    constructor(
        private worldStartGrowing: WorldStartGrowingEventQueue,
        private worldGrows: WorldPopulationGrowsEventQueue,
        private worldStopsGrowing: WorldStopGrowingEventQueue,
    ) {

    }

    key = POPULATION_SYSTEM_KEY

    queue: GameEventQueue = {
        upcomingEvent$: combineEventQueues([
            this.worldStartGrowing,
            this.worldGrows,
            this.worldStopsGrowing
        ])
    }

}

export function registerPopulationSystem(container: Container) {
    container.bind(WorldStartGrowingEventQueue).toSelf();
    container.bind(WorldPopulationGrowsEventQueue).toSelf();
    container.bind(WorldStopGrowingEventQueue).toSelf();
    container.bind(PopulationSystem).toSelf();
}