import { ContainerRegistry } from "../../../container-registry";
import { Subscription } from "../../../../shared/messages/subscriptions";
import { DataProvider } from "../data-provider";
import { GameListAllDataProvider } from "./game-list-all-data-provider";
import { Container } from "inversify";

export function getGameSetupDataProvider(registry: ContainerRegistry, subscription: Subscription, gameId: string | null | undefined): DataProvider {
  const container = registry.getContainerByGameId(gameId);
  switch (subscription.type) {
    case 'GAME/LIST_ALL':
      return container.get(GameListAllDataProvider) as DataProvider
  }

  throw new Error('unhandled case ' + subscription.type)
}

export function registerGameSetupDataProviders(container: Container) {
  container.bind(GameListAllDataProvider).toSelf();
}