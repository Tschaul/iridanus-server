import { ContainerRegistry } from "../../../container-registry";
import { Command } from "../../../../shared/messages/commands/commands";
import { CommandExecutor } from "../command-executor";
import { Container } from "inversify";
import { UpdateFleetOrdersExecutor } from "./update-fleet-orders-executor";
import { SurrenderGameExecutor } from "./surrender-game-executor";

export function getOrderCommandExecutor(registry: ContainerRegistry, command: Command, gameId: string | null | undefined): CommandExecutor<Command> {
  const container = registry.getContainerByGameId(gameId);
  switch (command.type) {
    case 'ORDERS/UPDATE_FLEET':
      return container.get(UpdateFleetOrdersExecutor) as CommandExecutor<Command>;
    case 'ORDERS/SURRENDER':
      return container.get(SurrenderGameExecutor) as CommandExecutor<Command>;
  }

  throw new Error('No command executor found for command type: ' + command.type)
}


export function registerOrderCommandExecutors(container: Container) {
  container.bind(UpdateFleetOrdersExecutor).toSelf();
  container.bind(SurrenderGameExecutor).toSelf();
}