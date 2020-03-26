import { Container } from "inversify";
import { SocketConnection } from "./socket-connection";
import { LobbyService } from "./lobby/lobby.service";
import { UserManagementService } from "./user-management/user-management.service";
import { GameStateService } from "./game-state/game-state.service";
import { OrderService } from "./orders/order-service";
import { NotificationService } from "./notifications/notification-service";

export function registerClient(container: Container) {
  container.bind(SocketConnection).toSelf();
  container.bind(LobbyService).toSelf();
  container.bind(GameStateService).toSelf();
  container.bind(UserManagementService).toSelf();
  container.bind(OrderService).toSelf();
  container.bind(NotificationService).toSelf();
}