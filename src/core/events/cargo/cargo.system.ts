import { Container, injectable } from "inversify";
import { combineEventQueues, GameEventQueue } from "../event";
import { GameSystem } from "../game-system";
import { BeginTransferingCargoEventQueue } from "./begin-transfering-cargo";
import { EndTransferingCargoEventQueue } from "./end-transfering-cargo";
import { StartCargoMissionEventQueue } from "./start-cargo-mission";
import { StopCargoMissionEventQueue } from "./stop-cargo-mission";

export const CARGO_SYSTEM_KEY = "CARGO";

@injectable()
export class CargoSystem implements GameSystem {

    constructor(
        private startCargoMission: StartCargoMissionEventQueue,
        private stopCargoMission: StopCargoMissionEventQueue,
        private beginTransferingCargo: BeginTransferingCargoEventQueue,
        private endTransferingCargo: EndTransferingCargoEventQueue,
    ) {

    }

    key = CARGO_SYSTEM_KEY

    queue: GameEventQueue = {
        upcomingEvent$: combineEventQueues([
            this.startCargoMission,
            this.stopCargoMission,
            this.beginTransferingCargo,
            this.endTransferingCargo,
        ])
    }

}

export function registerCargoSystem(container: Container) {
    container.bind(StartCargoMissionEventQueue).toSelf();
    container.bind(StopCargoMissionEventQueue).toSelf();
    container.bind(BeginTransferingCargoEventQueue).toSelf();
    container.bind(EndTransferingCargoEventQueue).toSelf();
    container.bind(CargoSystem).toSelf();
}