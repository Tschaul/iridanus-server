import { GameViewModel } from "./game-view-model";
import { computed } from "mobx";
import { worldhasOwner, World } from "../../../shared/model/v1/world";
import { Fleet } from "../../../shared/model/v1/fleet";
import { PlayerInfo } from "../../../shared/model/v1/player-info";
import { GameData } from "./game-data";
import { GameStageSelection } from "./stage-selection";
import { visibleWorldhasOwner } from "../../../shared/model/v1/visible-state";

export class SelectedWorldViewModel {

  constructor(
    private gameData: GameData,
    private selection: GameStageSelection,
    ) { }


  @computed public get playerInfoOfSelectedWorld() {
    if (this.selection.selectedWorld && visibleWorldhasOwner(this.selection.selectedWorld)) {
      return this.gameData.playerInfos[this.selection.selectedWorld.ownerId];
    } else {
      return null;
    }
  }

  @computed public get playerInfoOfWorldBeingCaptured() {
    const world = this.selection.selectedWorld;
    if (world && world.status !== 'UNKNOWN' && world.status !== 'REMEMBERED' && world.captureStatus === 'BEING_CAPTURED') {
      return this.gameData.playerInfos[world.capturingPlayerId];
    } else {
      return null;
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
}