import { GameViewModel } from "./game/game-view-model";
import { observable, computed, when } from "mobx";
import { WelcomeViewModel } from "./welcome/welcome-view-model";
import { LobbyViewModel } from "./lobby/lobby-view-model";
import { ConnectionStatus } from "./connection-status";
import { ServerEnvironment } from "./server-environment";

export type PossibleScreen = 'GAME' | 'WELCOME' | 'LOBBY';

export class MainViewModel {

  public connectionStatus = new ConnectionStatus();
  public environment = new ServerEnvironment();

  constructor() {

    when(
      () => this.connectionStatus.isConnected,
      async () => {
        this.environment.initialize();
        await this.parseLocation();

        // this.welcomeViewModel.username = 'tschaul';
        // this.welcomeViewModel.password = '123456';
        // this.welcomeViewModel.login();
    
        // this.lobbyViewModel.selectedGameId = 'ufs5i8wkd71v';
        // this.lobbyViewModel.viewGame();
      }
    )
  }

  @computed get activeScreen(): PossibleScreen {
    if (!this.loggedInUserId) {
      return 'WELCOME'
    }
    if (!this.activeGameId) {
      return 'LOBBY'
    }
    return 'GAME'
  }

  @observable
  loggedInUserId: string | null = null;

  @observable
  activeGameId: string | null = null;

  public gameViewModel = new GameViewModel(this);
  public welcomeViewModel = new WelcomeViewModel(this);
  public lobbyViewModel = new LobbyViewModel(this);

  private async parseLocation() {
    const hash = location.hash;
    if (!hash.startsWith('#')) {
      return;
    }

    const split = hash.slice(1).split('/');

    switch (split[0]) {
      case 'confirm-email':
        await this.welcomeViewModel.confirmEmail(split[1], split[2])
        break;
        case 'reset-password':
          await this.welcomeViewModel.prepareResetPassword(split[1], split[2])
          break;
      default:
    }

    history.replaceState("", document.title, location.pathname + location.search);

  }
}