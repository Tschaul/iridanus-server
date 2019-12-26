import { injectable } from "inversify";
import { Command } from "../../shared/messages/commands";
import { CommandExecutor } from "./executors/command-executor";
import { ContainerRegistry } from "../container-registry";
import { CreateGameExecutor } from "./executors/game-setup/create-game-executor";
import { ResponseMessage } from "../../shared/messages/response-message";
import { SignUpUserExecutor } from "./executors/authentication/sign-up-user-executor";

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
    executor.execute(command).catch((error) => {
      sendfn({
        type: 'ERROR',
        error: error + ''
      })
    })
  }

  private getDataProvider(registry: ContainerRegistry, command: Command, gameId: string | null | undefined): CommandExecutor<Command> {
    const container = registry.getContainerByGameId(gameId);
    switch (command.type) {
      case 'CREATE_GAME':
        return container.get(CreateGameExecutor) as CommandExecutor<Command>;
      case 'SIGN_UP_USER':
        return container.get(SignUpUserExecutor) as CommandExecutor<Command>;
    }
  }
}