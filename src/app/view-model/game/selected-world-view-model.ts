import { GameViewModel } from "./game-view-model";
import { computed } from "mobx";
import { worldhasOwner, World } from "../../../shared/model/world";
import { fleetHasOwner, Fleet } from "../../../shared/model/fleet";

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