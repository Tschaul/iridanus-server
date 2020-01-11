import { GameViewModel } from "./game/game-view-model";
import { observable } from "mobx";
import { WelcomeViewModel } from "./welcome/welcome-view-model";

type PossibleScreen = 'GAME' | 'WELCOME' | 'LOBBY';

export class MainViewModel {
  
  @observable
  activeScreen: PossibleScreen = 'WELCOME';

  public gameViewModel = new GameViewModel(this);
  public welcomeViewModel = new WelcomeViewModel(this);

}