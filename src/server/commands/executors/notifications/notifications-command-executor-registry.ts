import { ContainerRegistry } from "../../../container-registry";
import { Command } from "../../../../shared/messages/commands/commands";
import { CommandExecutor } from "../command-executor";
import { Container } from "inversify";
import { NotificationsMarkAsReadExecutor } from "./notifications-mark-as-read-executor";

export function getNotificationCommandExecutor(registry: ContainerRegistry, command: Command, gameId: string | null | undefined): CommandExecutor<Command> {
  const container = registry.getContainerByGameId(gameId);
  switch (command.type) {
    case 'NOTIFICATIONS/MARK_AS_READ':
      return container.get(NotificationsMarkAsReadExecutor) as CommandExecutor<Command>;
  }

  throw new Error('No command executor found for command type: ' +  command.type)
}


export function registerNotificationCommandExecutors(container: Container) {
  container.bind(NotificationsMarkAsReadExecutor).toSelf();
}