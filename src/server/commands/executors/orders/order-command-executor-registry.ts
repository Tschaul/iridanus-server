import { ContainerRegistry } from "../../../container-registry";
import { Command } from "../../../../shared/messages/commands/commands";
import { CommandExecutor } from "../command-executor";
import { Container } from "inversify";
import { UpdateFleetOrdersExecutor } from "./update-fleet-orders-executor";
import { UpdateWorldOrdersExecutor } from "./update-world-orders-executor";

export function getOrderCommandExecutor(registry: ContainerRegistry, command: Command, gameId: string | null | undefined): CommandExecutor<Command> {
  switch (command.type) {
    case 'ORDERS/UPDATE_FLEET':
      return registry.globalContainer.get(UpdateFleetOrdersExecutor) as CommandExecutor<Command>;
    case 'ORDERS/UPDATE_WORLD':
      return registry.globalContainer.get(UpdateWorldOrdersExecutor) as CommandExecutor<Command>;
  }

  throw new Error('No command executor found for command type: ' +  command.type)
}


export function registerOrderCommandExecutors(container: Container) {
  container.bind(UpdateFleetOrdersExecutor).toSelf();
  container.bind(UpdateWorldOrdersExecutor).toSelf();
}