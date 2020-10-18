import { injectable } from "inversify";
import { CommandExecutor } from "../command-executor";
import { SurrenderGameCommand } from "../../../../shared/messages/commands/order-commands";
import { Store } from "../../../../core/store";
import { Clock } from "../../../../core/infrastructure/clock";
import { surrenderPlayer } from "../../../../core/actions/player/surrender-player";

@injectable()
export class SurrenderGameExecutor implements CommandExecutor<SurrenderGameCommand> {
  authenticationRequired = true;

  constructor(private store: Store, private clock: Clock) { }

  async execute(command: SurrenderGameCommand, userId: string) {

    this.store.dispatch(surrenderPlayer(userId));
    this.store.commit(this.clock.getTimestamp());
  }

}