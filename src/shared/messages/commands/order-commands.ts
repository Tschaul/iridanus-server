import { WorldOrder } from "../../model/v1/world-order";
import { FleetOrder } from "../../model/v1/fleet-orders";

export type OrderCommand = UpdateWorldOrdersCommand
  | UpdateFleetOrdersCommand;

export interface UpdateWorldOrdersCommand {
  type: 'ORDERS/UPDATE_WORLD',
  orders: WorldOrder[]
}

export interface UpdateFleetOrdersCommand {
  type: 'ORDERS/UPDATE_FLEET',
  orders: FleetOrder[]
}