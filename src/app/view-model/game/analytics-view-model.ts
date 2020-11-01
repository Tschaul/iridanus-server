import { computed, observable } from "mobx";
import { fromStream, IStreamListener } from "mobx-utils";
import { EMPTY } from "rxjs";
import { GameAnalytics } from "../../../shared/model/v1/game-analytics";
import { GameStateService } from "../../client/game-state/game-state.service";
import { resolveFromRegistry } from "../../container-registry";
import { GameClock } from "./clock";
import { GameData } from "./game-data";
import { GameViewModel } from "./game-view-model";

export class AnalyticsViewModel {
  
  @observable private analytics: IStreamListener<GameAnalytics> = fromStream(EMPTY, {curve: []});

  private gameStateService = resolveFromRegistry(GameStateService);

  constructor(private gameViewModel: GameViewModel, private clock: GameClock) {

  }

  @computed get populationData() {
    return this.analytics.current.curve.map(item => {
      return {
        timestamp: item.timestamp,
        ...item.population
      }
    })
  }

  @computed get shipsData() {
    return this.analytics.current.curve.map(item => {
      return {
        timestamp: item.timestamp,
        ...item.ships
      }
    })
  }

  @computed get timestampRange() {
    const curve = this.analytics.current.curve;
    const first = curve[0]?.timestamp ?? 0;
    const last = curve[curve.length - 1]?.timestamp ?? 0;
    return [first, last];
  }

  focus() {
    const gameId = this.gameViewModel.gameId as string;
    this.analytics = fromStream(this.gameStateService.getGameAnalyticsById(gameId), {curve: []});
  }

  unfocus() {

  }

  setTimestamp(timestamp: number) {
    this.clock.fixedTimestamp = timestamp;
  }

  resetTimestamp() {
    this.clock.fixedTimestamp = null;
  }

  closeAnalyticsPanel() {
    this.gameViewModel.analyticsPanelIsOpen = false;
  }

}