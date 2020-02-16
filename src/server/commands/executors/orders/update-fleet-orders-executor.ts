import { injectable } from "inversify";
import { CommandExecutor } from "../command-executor";
import { UpdateFleetOrdersCommand } from "../../../../shared/messages/commands/order-commands";
import { Store } from "../../../../core/store";
import { putFleetOrders } from "../../../../core/actions/fleet/put-fleet-orders";
import { first } from "rxjs/operators";

@injectable()
export class UpdateFleetOrdersExecutor implements CommandExecutor<UpdateFleetOrdersCommand> {
  authenticationRequired = true;

  constructor(private store: Store) { }

  async execute(command: UpdateFleetOrdersCommand, userId: string) {

    const state = await this.store.state$.pipe(first()).toPromise();

    const fleet = state.universe.fleets[command.fleetId];

    if (!fleet || fleet.status === 'LOST' || fleet.ownerId !== userId) {
      throw new Error('Invalid fleet order command');
    }

    this.store.dispatch(putFleetOrders(command.fleetId, command.orders));
  }

}