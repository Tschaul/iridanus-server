import { ContainerRegistry } from "../../../container-registry";
import { Subscription } from "../../../../shared/messages/subscriptions";
import { DataProvider } from "../data-provider";
import { GamesListDataProvider } from "./games-list-data-provider";
import { Container } from "inversify";

export function getGameSetupDataProvider(registry: ContainerRegistry, subscription: Subscription, gameId: string | null | undefined): DataProvider {
  const container = registry.getContainerByGameId(gameId);
  switch (subscription.type) {
    case 'GAME/LIST':
      return container.get(GamesListDataProvider) as DataProvider
  }

  throw new Error('unhandled case ' + subscription.type)
}

export function registerGameSetupDataProviders(container: Container) {
  container.bind(GamesListDataProvider).toSelf();
}