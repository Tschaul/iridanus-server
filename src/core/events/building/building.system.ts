import { Container, injectable } from "inversify";
import { combineEventQueues, GameEventQueue } from "../event";
import { GameSystem } from "../game-system";
import { BeginBuildingShipEventQueue } from "./begin-building-ship";
import { ContinueOrStopBuildingShipEventQueue } from "./continue-building-ship";
import { EndBuildShipsEventQueue } from "./end-build-ship";

export const BUILDING_SYSTEM_KEY = "BUILDING";

@injectable()
export class BuildingSystem implements GameSystem {

    constructor(
        private beginBuildShips: BeginBuildingShipEventQueue,
        private endBuildShips: EndBuildShipsEventQueue,
        private continueOrStopBuildShips: ContinueOrStopBuildingShipEventQueue,
    ) {

    }

    key = BUILDING_SYSTEM_KEY

    queue: GameEventQueue = {
        upcomingEvent$: combineEventQueues([
            this.beginBuildShips,
            this.endBuildShips,
            this.continueOrStopBuildShips
        ])
    }

}

export function registerBuildSystem(container: Container) {
    container.bind(BeginBuildingShipEventQueue).toSelf();
    container.bind(ContinueOrStopBuildingShipEventQueue).toSelf();
    container.bind(EndBuildShipsEventQueue).toSelf();
    container.bind(BuildingSystem).toSelf();
}