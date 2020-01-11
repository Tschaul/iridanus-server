import { GameViewModel } from "./game/game-view-model";
import { observable } from "mobx";
import { WelcomeViewModel } from "./welcome/welcome-view-model";
import { LobbyViewModel } from "./lobby/lobby-view-model";

type PossibleScreen = 'GAME' | 'WELCOME' | 'LOBBY';

export class MainViewModel {
  
  @observable
  activeScreen: PossibleScreen = 'WELCOME';

  @observable
  loggedInUserId: string | null = null;



  public gameViewModel = new GameViewModel(this);
  public welcomeViewModel = new WelcomeViewModel(this);
  public lobbyViewModel = new LobbyViewModel(this);

}