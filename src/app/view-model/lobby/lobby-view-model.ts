import { LobbyService } from "../../client/lobby/lobby.service";
import { resolveFromRegistry } from "../../container-registry";
import { MainViewModel } from "../main-view-model";
import { fromStream, IStreamListener } from "mobx-utils";
import { observable, computed } from "mobx";
import { empty } from "rxjs";
import { GameInfo } from "../../../shared/model/v1/game-info";
import { GameMap } from "../../../shared/model/v1/game-map";
import { GameRuleSet } from "../../../shared/model/v1/rules";

export class LobbyViewModel {

  private lobbyService = resolveFromRegistry(LobbyService);

  constructor(private mainViewModel: MainViewModel) { 
  }

  @computed
  public get loggedInUserId() {
    return this.mainViewModel.loggedInUserId;
  }

  @observable
  public allGames: IStreamListener<GameInfo[]> = fromStream(empty(), [])

  @observable
  public allMaps: IStreamListener<GameMap[]> = fromStream(empty(), [])

  @observable
  public allRulesSets: IStreamListener<GameRuleSet[]> = fromStream(empty(), [])

  public focus() {
    this.allGames = fromStream(this.lobbyService.allGames$, []);
    this.allMaps = fromStream(this.lobbyService.finalMaps$, []);
    this.allRulesSets = fromStream(this.lobbyService.finalRuleSets$, []);
  }

  public unfocus() {
    this.allGames.dispose()
    this.allMaps.dispose()
    this.allRulesSets.dispose()
  }

  @observable
  public selectedGameId: string | null = null;

  public async createGame() {
    await this.lobbyService.createGame();
  }
  public async joinGame(gameId: string) {
    await this.lobbyService.joinGame(gameId);
  }
  public async readyForGame(gameId: string) {
    await this.lobbyService.readyForGame(gameId);
  }

}