import { GameViewModel } from "./game/game-view-model";
import { observable, computed, when, autorun } from "mobx";
import { WelcomeViewModel } from "./welcome/welcome-view-model";
import { LobbyViewModel } from "./lobby/lobby-view-model";
import { ConnectionStatus } from "./connection-status";
import { ServerEnvironment } from "./server-environment";
import { AccountViewModel } from "./account/account-view-model";

export type PossibleScreen = 'GAME' | 'WELCOME' | 'LOBBY' | 'ACCOUNT';

const IRIDANUS_GAME_ID_LOCAL_STORAGE_LOCATION = 'iridanus_selected_game_id'

export class MainViewModel {

  public connectionStatus = new ConnectionStatus();
  public environment = new ServerEnvironment();

  constructor() {

    when(
      () => this.connectionStatus.isConnected,
      async () => {

        this.environment.initialize();

        await this.parseLocation();

        const gameId = window.localStorage.getItem(IRIDANUS_GAME_ID_LOCAL_STORAGE_LOCATION);
        if (gameId){
          this.lobbyViewModel.selectedGameId = gameId;
          this.lobbyViewModel.viewGame();
        }

        autorun(() => {
          if (this.activeGameId) {
            window.localStorage.setItem(IRIDANUS_GAME_ID_LOCAL_STORAGE_LOCATION, this.activeGameId)
          } else {
            window.localStorage.removeItem(IRIDANUS_GAME_ID_LOCAL_STORAGE_LOCATION)
          }
        })

      }
    )
  }

  @computed get activeScreen(): PossibleScreen {
    if (!this.loggedInUserId) {
      return 'WELCOME'
    }
    if (this.showAccountSettings) {
      return 'ACCOUNT'
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

  @observable
  showAccountSettings: boolean = false;

  @observable
  screenMode: 'SMALL' | 'LARGE' | 'NONE' = 'NONE'

  @observable
  screenDimensions: [number, number] = [0, 0]

  public gameViewModel = new GameViewModel(this);
  public welcomeViewModel = new WelcomeViewModel(this);
  public lobbyViewModel = new LobbyViewModel(this);
  public accountViewModel = new AccountViewModel(this, this.environment);

  logout() {
    this.welcomeViewModel.logout();
    this.loggedInUserId = null;
  }

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