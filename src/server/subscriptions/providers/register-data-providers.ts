import { Container } from "inversify";
import { registerGameSetupDataProviders } from "./game-setup/game-setup-data-provider-registry";
import { registerMapDataProviders } from "./maps/maps-data-provider-registry";
import { registerRulesDataProviders } from "./rules/rules-data-provider-registry";

export function registerGlobalDataProviders(container: Container) {
  registerGameSetupDataProviders(container);
  registerMapDataProviders(container);
  registerRulesDataProviders(container);
}