import { injectable } from "inversify";
import { SocketConnection } from "../socket-connection";
import { FleetOrder } from "../../../shared/model/v1/fleet-orders";
import { Command } from "../../../shared/messages/commands/commands";

@injectable()
export class OrderService {

  constructor(private connection: SocketConnection) { }

  async updateFleetOrders(gameId: string, fleetId: string, orders: FleetOrder[]): Promise<void> {
    await this.connection.sendCommand({
      type: 'ORDERS/UPDATE_FLEET',
      fleetId,
      orders
    }, gameId)
  }

  async setLastWillFleetOrders(gameId: string, orderByFleet: { [fleetId: string]: FleetOrder[] }): Promise<void> {
    const commands: Command[] = [];
    Object.getOwnPropertyNames(orderByFleet).forEach(fleetId => {
      commands.push({
          type: 'ORDERS/UPDATE_FLEET',
          fleetId,
          orders: orderByFleet[fleetId]
      })
    })
    await this.connection.setLastWill(commands, gameId)
  }

}