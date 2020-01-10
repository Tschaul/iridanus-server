import { Container } from "inversify";
import { DataHandleRegistry } from "./data-handle-registry";
import { UserRepository } from "./users/user-repository";
import { GameRepository } from "./games/games-repository";
import { MapRepository } from "./maps/map-repository";
import { RulesRepository } from "./rules/rules-repository";

export function registerRepositories(container: Container) {
  container.bind(DataHandleRegistry).toSelf();
  container.bind(UserRepository).toSelf();
  container.bind(GameRepository).toSelf();
  container.bind(MapRepository).toSelf();
  container.bind(RulesRepository).toSelf();
}