import { Container, injectable } from "inversify";
import { combineEventQueues, GameEventQueue } from "../event";
import { GameSystem } from "../game-system";
import { FleetFireEventQueue } from "./fleet-fire";
import { FleetStartFiringEventQueue } from "./fleet-start-firing";
import { FleetStopFiringEventQueue } from "./fleet-stop-firing";
import { LooseFleetEventQueue } from "./loose-fleet";

export const COMBAT_SYSTEM_KEY = "COMBAT";

@injectable()
export class CombatSystem implements GameSystem {

    constructor(
        private fleetStartFiring: FleetStartFiringEventQueue,
        private fleetFire: FleetFireEventQueue,
        private fleetStopFiring: FleetStopFiringEventQueue,
        private looseFleet: LooseFleetEventQueue,
    ) {

    }

    key = COMBAT_SYSTEM_KEY

    queue: GameEventQueue = {
        upcomingEvent$: combineEventQueues([
            this.fleetStartFiring,
            this.fleetFire,
            this.fleetStopFiring,
            this.looseFleet,
        ])
    }

}

export function registerCombatSystem(container: Container) {
    container.bind(FleetStartFiringEventQueue).toSelf();
    container.bind(FleetFireEventQueue).toSelf();
    container.bind(FleetStopFiringEventQueue).toSelf();
    container.bind(LooseFleetEventQueue).toSelf();
    container.bind(CombatSystem).toSelf();
}