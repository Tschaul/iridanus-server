import { injectable } from "inversify";
import { Command } from "../../shared/messages/commands/commands";
import { CommandExecutor } from "./executors/command-executor";
import { ContainerRegistry } from "../container-registry";
import { ResponseMessage } from "../../shared/messages/response-message";
import { SignUpUserExecutor } from "./executors/authentication/sign-up-user-executor";
import { GlobalErrorHandler } from "../infrastructure/error-handling/global-error-handler";
import { Initializer } from "../infrastructure/initialisation/initializer";
import { getGameSetupCommandExecutor } from "./executors/game-setup/game-setup command-executor-registry";

@injectable()
export class CommandHandler {
  constructor() { }

  public async handleCommand(
    registry: ContainerRegistry,
    command: Command,
    commandId: string,
    gameId: string | null | undefined,
    userId: string | null,
    sendfn: (data: ResponseMessage) => void
  ) {
    const executor = this.getCommandExecutor(registry, command, gameId);

    if (executor.authenticationRequired && userId == null) {
      sendfn({
        type: 'ERROR',
        error: 'Authentication required',
        commandId
      })
      return;
    }

    const globalErrorHandler = registry.globalContainer.get(GlobalErrorHandler);
    const initializer = registry.globalContainer.get(Initializer);

    await initializer.initializeAllRequested()

    try {
      await executor.execute(command, userId);
      sendfn({
        type: 'COMMAND_SUCCESS',
        commandId
      })
    } catch (error) {
      globalErrorHandler.handleError(error);
      sendfn({
        type: 'ERROR',
        error: error + '',
        commandId
      })
    }
  }

  private getCommandExecutor(registry: ContainerRegistry, command: Command, gameId: string | null | undefined): CommandExecutor<Command> {
    const container = registry.getContainerByGameId(gameId);

    const firstParh = command.type.split('/')[0];

    switch (firstParh) {
      case 'GAME':
        return getGameSetupCommandExecutor(registry, command, gameId);
      case 'SIGN_UP_USER':
        return container.get(SignUpUserExecutor) as CommandExecutor<Command>;
      
    }

    throw new Error('No command executor found for command type: ' + command.type)
  }
}