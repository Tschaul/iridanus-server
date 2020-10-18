import { LobbyService } from "../../client/lobby/lobby.service";
import { resolveFromRegistry } from "../../container-registry";
import { MainViewModel } from "../main-view-model";
import { fromStream, IStreamListener } from "mobx-utils";
import { observable, computed } from "mobx";
import { EMPTY } from "rxjs";
import { GameInfo } from "../../../shared/model/v1/game-info";
import { GameMap } from "../../../shared/model/v1/game-map";
import { GameRuleSet } from "../../../shared/model/v1/rules";


export class LobbyViewModel {

  private lobbyService = resolveFromRegistry(LobbyService);

  constructor(private mainViewModel: MainViewModel) {
  }

  @computed
  public get loggedInUserId() {
    return this.mainViewModel.loggedInUserId as string;
  }

  @computed
  public get gamesToDisplay() {
    return this.allGames.current.filter(game => {
      return game.state === 'PROPOSED' || game.players[this.loggedInUserId]
    })
  }

  @observable
  public allGames: IStreamListener<GameInfo[]> = fromStream(EMPTY, [])

  @observable
  public allMaps: IStreamListener<GameMap[]> = fromStream(EMPTY, [])

  @observable
  public allRulesSets: IStreamListener<GameRuleSet[]> = fromStream(EMPTY, [])

  public focus() {
    this.allGames = fromStream(this.lobbyService.allGames$, []);
  }

  public unfocus() {
    this.allGames.dispose()
    this.allMaps.dispose()
    this.allRulesSets.dispose()
  }

  @observable
  public selectedGameId: string | null = null;

  @computed
  public get selectedGame() {
    if (this.selectedGameId) {
      return this.allGames.current.find(game => game.id === this.selectedGameId) || null
    } else {
      return null
    }
  }

  public async createGame() {
    await this.lobbyService.createGame();
  }

  public async logout() {
    await this.mainViewModel.logout();
  }

  public async joinGame() {
    if (!this.selectedGameId) {
      return
    }
    await this.lobbyService.joinGame(this.selectedGameId);
  }

  public async readyForGame() {
    if (!this.selectedGameId) {
      return
    }
    await this.lobbyService.readyForGame(this.selectedGameId);
  }

  public async surrenderGame() {
    if (!this.selectedGameId) {
      return
    }
    await this.lobbyService.surrenderGame(this.selectedGameId);
  }

  public async toggleSpecatatorMode() {
    if (!this.selectedGameId) {
      return
    }
    await this.lobbyService.toggleSpectatorModeForGame(this.selectedGameId);
  }

  public async viewGame() {
    if (!this.selectedGameId) {
      return
    }
    this.mainViewModel.activeGameId = this.selectedGameId;
  }

  public showAccountSettings() {
    this.mainViewModel.showAccountSettings = true;
  }

}