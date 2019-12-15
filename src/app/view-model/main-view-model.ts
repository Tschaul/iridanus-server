import { injectable } from "inversify";
import { GameViewModel } from "./game/game-view-model";

type PossibleScreen = 'GAME';

@injectable()
export class MainViewModel {
  
  activeScreen: PossibleScreen = 'GAME';

  public gameViewModel = new GameViewModel(this);

}