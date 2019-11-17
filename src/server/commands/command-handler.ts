import { injectable } from "inversify";
import { Command } from "../../shared/messages/commands";
import { CommandExecutor } from "./executors/command-executor";
import { ContainerRegistry } from "../container-registry";
import { CreateGameExecutor } from "./executors/create-game-executor";
import { ResponseMessage } from "../../shared/messages/response-message";

@injectable()
export class CommandHandler {
  constructor() {}

  public handleCommand(
    registry: ContainerRegistry, 
    command: Command, 
    gameId: string | null | undefined,
    sendfn: (data: ResponseMessage) => void
  ) {
    const executor = this.getDataProvider(registry, command, gameId);
    executor.execute(command, (error) => {
      sendfn({
        type: 'ERROR',
        error
      })
    })
  }

  private getDataProvider(registry: ContainerRegistry, subscription: Command, gameId: string | null | undefined): CommandExecutor {
    const container = registry.getContainerByGameId(gameId);
    switch (subscription.type) {
      case 'CREATE_GAME':
        return container.get(CreateGameExecutor) as CommandExecutor
    }

    throw new Error('unhandled case ' + subscription.type)
  }
}