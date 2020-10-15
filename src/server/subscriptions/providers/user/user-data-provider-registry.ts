import { ContainerRegistry } from "../../../container-registry";
import { DataProvider } from "../data-provider";
import { Container } from "inversify";
import { UserInfoSubscription } from "../../../../shared/messages/subscriptions/user-subscriptions";
import { UserInfoDataProvider } from "./user-info-data-provider";

export function getUserInfoDataProvider(registry: ContainerRegistry, subscription: UserInfoSubscription): DataProvider {
  const container = registry.globalContainer;
  switch (subscription.type) {
    case 'USER/INFO':
      return container.get(UserInfoDataProvider) as DataProvider
  }
}

export function registerGlobalUserInfoDataProviders(container: Container) {
  container.bind(UserInfoDataProvider).toSelf();
}