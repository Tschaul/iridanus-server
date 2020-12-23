import { Container, injectable } from "inversify";
import { combineEventQueues, GameEventQueue } from "../event";
import { GameSystem } from "../game-system";
import { FleetSplitsEventQueue } from "./fleet-splits";

export const FLEET_GROUPING_SYSTEM_KEY = "FLEET_GROUPING";

@injectable()
export class FleetGroupingSystem implements GameSystem {

    constructor(
        private fleetSplits: FleetSplitsEventQueue,
    ) {

    }

    key = FLEET_GROUPING_SYSTEM_KEY

    queue: GameEventQueue = {
        upcomingEvent$: combineEventQueues([
            this.fleetSplits,
        ])
    }

}

export function registerFleetGroupingSystem(container: Container) {
    container.bind(FleetSplitsEventQueue).toSelf();
    container.bind(FleetGroupingSystem).toSelf();
}