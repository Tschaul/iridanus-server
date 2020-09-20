import { Observable } from "rxjs";
import { FleetOrder } from "../shared/model/v1/fleet-orders";
import { Universe } from "../shared/model/v1/universe";

export enum FleetAssignement {
  Economy,
  Army
}

export interface FleetAssignements {
  [fleetId: string]: FleetAssignement
}

export interface FleetOrders {
  [fleetId: string]: FleetOrder[]
}

export interface Ai {

  play(playerId: string): void

}