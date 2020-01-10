import { ContainerRegistry } from "../../../container-registry";
import { Subscription } from "../../../../shared/messages/subscriptions";
import { DataProvider } from "../data-provider";
import { Container } from "inversify";
import { RulesListAllDataProvider } from "./rules-list-all-data-provider";
import { RulesListFinalDataProvider } from "./rules-list-final-data-provider copy";

export function getRulesDataProvider(registry: ContainerRegistry, subscription: Subscription, gameId: string | null | undefined): DataProvider {
  const container = registry.getContainerByGameId(gameId);
  switch (subscription.type) {
    case 'RULES/LIST_ALL':
      return container.get(RulesListAllDataProvider) as DataProvider
    case 'RULES/LIST_FINAL':
      return container.get(RulesListFinalDataProvider) as DataProvider
  }

  throw new Error('unhandled case ' + subscription.type)
}

export function registerRulesDataProviders(container: Container) {
  container.bind(RulesListAllDataProvider).toSelf();
  container.bind(RulesListFinalDataProvider).toSelf();
}