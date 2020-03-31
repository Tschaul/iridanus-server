import { ContainerRegistry } from "../../../container-registry";
import { DataProvider } from "../data-provider";
import { Container } from "inversify";
import { EnvironmentSubscription } from "../../../../shared/messages/subscriptions/environment-subscriptions";
import { EnvironmentInfoDataProvider } from "./environment-info-data-provider";

export function getEnvironmentDataProvider(registry: ContainerRegistry, subscription: EnvironmentSubscription): DataProvider {
  const container = registry.globalContainer;
  switch (subscription.type) {
    case 'ENVIRONMENT/INFO':
      return container.get(EnvironmentInfoDataProvider) as DataProvider
  }
}

export function registerGlobalEnvironmentSetupDataProviders(container: Container) {
  container.bind(EnvironmentInfoDataProvider).toSelf();
}