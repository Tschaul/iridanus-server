import { Container } from "inversify";
import { DataHandleRegistry } from "./data-handle-registry";
import { UserRepository } from "./users/user-repository";
import { GamesRepository } from "./games/games-repository";

export function registerRepositories(container: Container) {
  container.bind(DataHandleRegistry).toSelf();
  container.bind(UserRepository).toSelf();
  container.bind(GamesRepository).toSelf();
}