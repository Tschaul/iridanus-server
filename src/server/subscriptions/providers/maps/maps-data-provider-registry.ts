import { ContainerRegistry } from "../../../container-registry";
import { Subscription } from "../../../../shared/messages/subscriptions";
import { DataProvider } from "../data-provider";
import { Container } from "inversify";
import { MapListAllDataProvider } from "./map-list-all-data-provider";
import { MapListFinalDataProvider } from "./map-list-final-data-provider copy";

export function getMapDataProvider(registry: ContainerRegistry, subscription: Subscription, gameId: string | null | undefined): DataProvider {
  const container = registry.getContainerByGameId(gameId);
  switch (subscription.type) {
    case 'MAP/LIST_ALL':
      return container.get(MapListAllDataProvider) as DataProvider
    case 'MAP/LIST_FINAL':
      return container.get(MapListFinalDataProvider) as DataProvider
  }

  throw new Error('unhandled case ' + subscription.type)
}

export function registerMapDataProviders(container: Container) {
  container.bind(MapListAllDataProvider).toSelf();
  container.bind(MapListFinalDataProvider).toSelf();
}