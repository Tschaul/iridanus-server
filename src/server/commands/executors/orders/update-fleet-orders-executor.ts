import { injectable } from "inversify";
import { CommandExecutor } from "../command-executor";
import { UpdateFleetOrdersCommand } from "../../../../shared/messages/commands/order-commands";
import { Store } from "../../../../core/store";
import { putFleetOrders } from "../../../../core/actions/fleet/put-fleet-orders";
import { first } from "rxjs/operators";
import { Clock } from "../../../../core/infrastructure/clock";

@injectable()
export class UpdateFleetOrdersExecutor implements CommandExecutor<UpdateFleetOrdersCommand> {
  authenticationRequired = true;

  constructor(private store: Store, private clock: Clock) { }

  async execute(command: UpdateFleetOrdersCommand, userId: string) {

    const state = await this.store.state$.pipe(first()).toPromise();

    const fleet = state.universe.fleets[command.fleetId];

    if (!fleet || fleet.ownerId !== userId) {
      throw new Error('Invalid fleet order command');
    }

    this.store.dispatch(putFleetOrders(command.fleetId, command.orders));
    this.store.commit(this.clock.getTimestamp());
  }

}