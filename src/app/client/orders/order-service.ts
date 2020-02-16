import { injectable } from "inversify";
import { SocketConnection } from "../socket-connection";
import { FleetOrder } from "../../../shared/model/v1/fleet-orders";
import { WorldOrder } from "../../../shared/model/v1/world-order";

@injectable()
export class OrderService {

  constructor(private connection: SocketConnection) {}

  async updateFleetOrders(gameId: string, fleetId: string, orders: FleetOrder[]): Promise<void> {
    await this.connection.sendCommand({
      type: 'ORDERS/UPDATE_FLEET',
      fleetId,
      orders
    }, gameId)
  }

  async updateWorldOrders(gameId: string, worldId: string, orders: WorldOrder[]): Promise<void> {
    await this.connection.sendCommand({
      type: 'ORDERS/UPDATE_WORLD',
      worldId,
      orders
    }, gameId)
  }

}