import { Container } from "inversify";
import { registerGameSetupDataProviders, registerGlobalGameSetupDataProviders } from "./game/game-data-provider-registry";
import { registerGlobalEnvironmentSetupDataProviders } from "./environment/environment-data-provider-registry";

export function registerGameDataProviders(container: Container) {
  registerGameSetupDataProviders(container);
}

export function registerGlobalDataProviders(container: Container) {
  registerGlobalGameSetupDataProviders(container);
  registerGlobalEnvironmentSetupDataProviders(container);
}