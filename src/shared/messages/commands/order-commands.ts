import { FleetOrder } from "../../model/v1/fleet-orders";

export type OrderCommand = UpdateFleetOrdersCommand;

export interface UpdateFleetOrdersCommand {
  type: 'ORDERS/UPDATE_FLEET',
  fleetId: string,
  orders: FleetOrder[]
}