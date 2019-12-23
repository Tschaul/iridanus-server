import { GameViewModel } from "./game-view-model";
import { computed } from "mobx";

export class OrderEditorViewModel {

  constructor(private gameViewModel: GameViewModel) { }

  @computed get selectionType() {
    if (this.gameViewModel.selectedFleet) {
      return 'FLEET';
    } else if(this.gameViewModel.selectedWorld) {
      return 'WORLD';
    } else {
      return 'NONE'
    }
  }

  @computed get orders() {
    switch (this.selectionType) {
      case 'FLEET':
        return this.gameViewModel.selectedFleet!.orders;
      case 'WORLD':
        return this.gameViewModel.selectedWorld!.orders;
      default:
        return [];
    }
  }

}