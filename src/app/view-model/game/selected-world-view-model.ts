import { GameViewModel } from "./game-view-model";
import { computed } from "mobx";
import { worldhasOwner } from "../../../shared/model/world";
import { fleetHasOwner } from "../../../shared/model/fleet";

export class SelectedWorldViewModel {

  constructor(private gameViewModel: GameViewModel) { }


  @computed public get playerInfoOfSelectedWorld() {
    if (this.gameViewModel.selectedWorld && worldhasOwner(this.gameViewModel.selectedWorld)) {
      return this.gameViewModel.playerInfos[this.gameViewModel.selectedWorld.ownerId];
    } else {
      return null;
    }
  }

  @computed get fleetsAtSelectedWorld() {
    const id = this.gameViewModel.selectedWorldId;
    if (id && this.gameViewModel.fleetsByWorldId[id]) {
      return this.gameViewModel.fleetsByWorldId[id].map(fleet => {
        const owner = fleetHasOwner(fleet) ? this.gameViewModel.playerInfos[fleet.ownerId] : null;
        return {
          ...fleet,
          owner
        };
      })
    } else {
      return [];
    }
  }

  public selectFleetId(id: string | null) {
    this.gameViewModel.selectedFleetdId = id;
  }
}