import { GameViewModel } from "./game-view-model";
import { computed } from "mobx";
import { worldhasOwner, World } from "../../../shared/model/v1/world";
import { fleetHasOwner, Fleet } from "../../../shared/model/v1/fleet";
import { PlayerInfo } from "../../../shared/model/v1/player-info";
import { GameData } from "./game-data";

export class SelectedWorldViewModel {

  constructor(
    private gameViewModel: GameViewModel,
    private gameData: GameData,
    ) { }


  @computed public get playerInfoOfSelectedWorld() {
    if (this.gameViewModel.selectedWorld && worldhasOwner(this.gameViewModel.selectedWorld)) {
      return this.gameData.playerInfos[this.gameViewModel.selectedWorld.ownerId];
    } else {
      return null;
    }
  }

  @computed get fleetsAtStageSelection(): Array<Fleet & { owner: PlayerInfo | null }> {
    switch (this.gameViewModel.stageSelection.type) {
      case 'WORLD':
        const id = this.gameViewModel.stageSelection.id;
        if (this.gameData.fleetsByWorldId[id]) {
          return this.gameData.fleetsByWorldId[id].map(fleet => {
            const owner = fleetHasOwner(fleet) ? this.gameData.playerInfos[fleet.ownerId] : null;
            return {
              ...fleet,
              owner
            };
          })
        } else {
          return [];
        }
      case 'GATE':
        const fleetMap = this.gameData.warpingFleetsByBothWorlds;
        const id1 = this.gameViewModel.stageSelection.id1;
        const id2 = this.gameViewModel.stageSelection.id2;
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
    return this.gameViewModel.selectedWorld;
  }

  public selectFleetId(id: string | null) {
    this.gameViewModel.selectedFleetdId = id;
  }

  public isWorldOrFleetSelected(isWorld: boolean, item: World | Fleet) {
    return (isWorld && !this.gameViewModel.selectedFleet)
      || (!isWorld && this.gameViewModel.selectedFleet && this.gameViewModel.selectedFleet.id === item.id)
  }
}