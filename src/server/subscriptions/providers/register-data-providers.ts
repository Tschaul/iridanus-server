import { Container } from "inversify";
import { registerGameSetupDataProviders } from "./game-setup/game-setup-data-provider-registry";

export function registerGlobalDataProviders(container: Container) {
  registerGameSetupDataProviders(container);
}