import { ContainerRegistry } from "../../../container-registry";
import { Command } from "../../../../shared/messages/commands/commands";
import { CommandExecutor } from "../command-executor";
import { CreateGameExecutor } from "./create-game-executor";
import { SetGameRulesGameExecutor } from "./set-game-rules-executor copy";
import { SetGameMapGameExecutor } from "./set-game-map-executor";
import { JoinGameExecutor } from "./join-game-executor";
import { ReadyForGameExecutor } from "./ready-for-game-executor";
import { Container } from "inversify";

export function getGameSetupCommandExecutor(registry: ContainerRegistry, command: Command, gameId: string | null | undefined): CommandExecutor<Command> {
  switch (command.type) {
    case 'GAME/CREATE':
      return registry.globalContainer.get(CreateGameExecutor) as CommandExecutor<Command>;
    case 'GAME/SET_RULES':
      return registry.globalContainer.get(SetGameRulesGameExecutor) as CommandExecutor<Command>;
    case 'GAME/SET_MAP':
      return registry.globalContainer.get(SetGameMapGameExecutor) as CommandExecutor<Command>;
    case 'GAME/JOIN':
      return registry.globalContainer.get(JoinGameExecutor) as CommandExecutor<Command>;
    case 'GAME/READY':
      return registry.globalContainer.get(ReadyForGameExecutor) as CommandExecutor<Command>;
  }

  throw new Error('No command executor found for command type: ' +  command.type)
}


export function registerGameSetupCommandExecutors(container: Container) {
  container.bind(CreateGameExecutor).toSelf();
  container.bind(SetGameRulesGameExecutor).toSelf();
  container.bind(SetGameMapGameExecutor).toSelf();
  container.bind(JoinGameExecutor).toSelf();
  container.bind(ReadyForGameExecutor).toSelf();
}