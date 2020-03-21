import { injectable } from "inversify";
import { CommandExecutor } from "../command-executor";
import { UpdateWorldOrdersCommand } from "../../../../shared/messages/commands/order-commands";
import { Store } from "../../../../core/store";
import { first } from "rxjs/operators";
import { putWorldOrders } from "../../../../core/actions/world/put-world-orders";
import { Clock } from "../../../../core/infrastructure/clock";

@injectable()
export class UpdateWorldOrdersExecutor implements CommandExecutor<UpdateWorldOrdersCommand> {
  authenticationRequired = true;

  constructor(private store: Store, private clock: Clock) { }

  async execute(command: UpdateWorldOrdersCommand, userId: string) {

    const state = await this.store.state$.pipe(first()).toPromise();

    const world = state.universe.worlds[command.worldId];

    if (!world || world.status === 'LOST' || world.ownerId !== userId) {
      throw new Error('Invalid world order command')
    }

    this.store.dispatch(putWorldOrders(command.worldId, command.orders));    
    this.store.commit(this.clock.getTimestamp());

  }

}