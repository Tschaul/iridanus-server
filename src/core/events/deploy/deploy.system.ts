import { Container } from "inversify";
import { combineEventQueues, GameEventQueue } from "../event";
import { GameSystem } from "../game-system";
import { FleetDeploysToWorldEventQueue } from "./fleet-deploys-to-world";

export const DEPLOY_SYSTEM_KEY = "DEPLOY";
export class DeploySystem implements GameSystem {

    constructor(
        private fleetDeploys: FleetDeploysToWorldEventQueue,
    ) {

    }

    key = DEPLOY_SYSTEM_KEY

    queue: GameEventQueue = {
        upcomingEvent$: combineEventQueues([
            this.fleetDeploys,
        ])
    }

}

export function registerDeploySystem(container: Container) {
    container.bind(FleetDeploysToWorldEventQueue).toSelf();
    container.bind(DeploySystem).toSelf();
}