import { GameViewModel } from "./game-view-model";
import { computed } from "mobx";
import { worldhasOwner } from "../../../shared/model/world";

export class SelectedWorldViewModel {

  constructor(private gameViewModel: GameViewModel) { }

  @computed public get selectedWorld() {
    const id = this.gameViewModel.selectedWorldId;
    if (id) {
      return this.gameViewModel.universe.worlds[id];
    } else {
      return null;
    }
  }

  @computed public get playerInfoOfSelectedWorld() {
    if (this.selectedWorld && worldhasOwner(this.selectedWorld)) {
      return this.gameViewModel.playerInfos[this.selectedWorld.ownerId];
    } else {
      return null;
    }
  }
}