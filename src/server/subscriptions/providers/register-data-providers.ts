import { Container } from "inversify";
import { registerGameSetupDataProviders, registerGlobalGameSetupDataProviders } from "./game/game-data-provider-registry";

export function registerGameDataProviders(container: Container) {
  registerGameSetupDataProviders(container);
}

export function registerGlobalDataProviders(container: Container) {
  registerGlobalGameSetupDataProviders(container);
}