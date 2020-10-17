import { ContainerRegistry } from "../../../container-registry";
import { DataProvider } from "../data-provider";
import { GameListAllDataProvider } from "./game-list-all-data-provider";
import { Container } from "inversify";
import { GameStateDataProvider } from "./game-state-data-provider";
import { GameInfoDataProvider } from "./game-info-data-provider";
import { GameMetaDataDataProvider } from "./game-meta-data-provider";
import { GameNotificationsDataProvider } from "./game-notifications-data-provider";
import { GameSubscription } from "../../../../shared/messages/subscriptions/game-subscriptions";
import { GameRulesDataProvider } from "./game-rules-data-provider";

export function getGameDataProvider(registry: ContainerRegistry, subscription: GameSubscription, gameId: string | null | undefined): DataProvider {
  const container = registry.getContainerByGameId(gameId);
  switch (subscription.type) {
    case 'GAME/LIST_ALL':
      return container.get(GameListAllDataProvider) as DataProvider
    case 'GAME/STATE':
      return container.get(GameStateDataProvider) as DataProvider
    case 'GAME/STATS':
      return container.get(GameStateDataProvider) as DataProvider
    case 'GAME/INFO':
      return container.get(GameInfoDataProvider) as DataProvider
    case 'GAME/META_DATA':
      return container.get(GameMetaDataDataProvider) as DataProvider
    case 'GAME/NOTIFICATIONS':
      return container.get(GameNotificationsDataProvider) as DataProvider
    case 'GAME/RULES':
      return container.get(GameRulesDataProvider) as DataProvider
  }
}

export function registerGameSetupDataProviders(container: Container) {
  container.bind(GameStateDataProvider).toSelf();
  container.bind(GameStateDataProvider).toSelf();
  container.bind(GameInfoDataProvider).toSelf();
  container.bind(GameMetaDataDataProvider).toSelf();
  container.bind(GameNotificationsDataProvider).toSelf();
  container.bind(GameRulesDataProvider).toSelf();
}

export function registerGlobalGameSetupDataProviders(container: Container) {
  container.bind(GameListAllDataProvider).toSelf();
}