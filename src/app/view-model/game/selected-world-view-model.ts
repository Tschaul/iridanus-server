import { GameViewModel } from "./game-view-model";
import { computed } from "mobx";
import { worldHasOwner, World } from "../../../shared/model/v1/world";
import { Fleet } from "../../../shared/model/v1/fleet";
import { PlayerInfo } from "../../../shared/model/v1/player-info";
import { GameData } from "./game-data";
import { GameStageSelection } from "./stage-selection";
import { visibleWorldhasOwner } from "../../../shared/model/v1/visible-state";
import { PlayersViewModel } from "./player-infos-view-model";
import { GameClock } from "./clock";
import { interval, Observable, of } from "rxjs";
import { getDisplayDuration } from "../../ui-components/display-duration";

export class SelectedWorldViewModel {

  constructor(
    private gameData: GameData,
    private selection: GameStageSelection,
    public readonly players: PlayersViewModel,
    private clock: GameClock
  ) { }


  @computed public get colorOfSelectedWorld() {
    return this.players.getColorForWorld(this.selection.selectedWorld)
  }

  @computed public get colorOrCapturingPlayer() {
    const world = this.selection.selectedWorld;
    if (world && visibleWorldhasOwner(world) && world.populationConversionStatus.type === 'BEING_CAPTURED') {
      return this.players.getColorForPlayer(world.populationConversionStatus.nextConvertingPlayerId)
    }
  }

  @computed get fleetsAtStageSelection(): Array<Fleet & { owner: PlayerInfo | null }> {
    switch (this.selection.stageSelection.type) {
      case 'WORLD':
        const id = this.selection.stageSelection.id;
        if (this.gameData.fleetsByWorldId[id]) {
          return this.gameData.fleetsByWorldId[id].map(fleet => {
            const owner = this.gameData.playerInfos[fleet.ownerId];
            return {
              ...fleet,
              owner
            };
          })
        } else {
          return [];
        }
      case 'GATE':
        const fleetMap = this.gameData.fleetsInTransitByBothWorlds;
        const id1 = this.selection.stageSelection.id1;
        const id2 = this.selection.stageSelection.id2;
        if (fleetMap[id1] && fleetMap[id1][id2]) {
          return fleetMap[id1][id2].map(fleet => {
            const owner = this.gameData.playerInfos[fleet.ownerId];
            return {
              ...fleet,
              owner
            };
          })
        } else {
          return [];
        }
      default:
        return [];
    }


  }

  @computed get selectedWorld() {
    return this.selection.selectedWorld;
  }

  public selectFleetId(id: string | null) {
    this.selection.selectFleet(id)
  }

  public isWorldOrFleetSelected(isWorld: boolean, item: World | Fleet) {
    return (isWorld && !this.selection.selectedFleet)
      || (!isWorld && this.selection.selectedFleet && this.selection.selectedFleet.id === item.id)
  }

  public showDamageStatusForFleet(fleet: Fleet) {
    return (this.clock.now - fleet.lastDamageTimestamp) < this.gameData.gameRules.combat.meanFiringInterval;
  }

  public getDisplayDuration(endTimestamp: number): Observable<string | null> {
    return getDisplayDuration(endTimestamp, this.clock.fixedTimestamp)
  }
}