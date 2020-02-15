import { Container } from "inversify";
import { registerGameSetupDataProviders } from "./game/game-data-provider-registry";

export function registerGlobalDataProviders(container: Container) {
  registerGameSetupDataProviders(container);
}