import { Container } from "inversify";
import { CounterDataProvider } from "./counter-data-provider";
import { registerGameSetupDataProviders } from "./game-setup/game-setup-data-provider-registry";

export function registerGlobalDataProviders(container: Container) {
  registerGameSetupDataProviders(container);
  container.bind(CounterDataProvider).toSelf();
}