import { Container } from "inversify";
import { MainViewModel } from "./main-view-model";
import { GameViewModel } from "./game/game-view-model";

export function registerViewModels(container: Container) {
  container.bind(MainViewModel).toSelf();
  container.bind(GameViewModel).toSelf();
}