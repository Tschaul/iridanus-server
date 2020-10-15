import { VisibleWorld, visibleWorldhasOwner } from "../../../shared/model/v1/visible-state";
import { GameData } from "./game-data";

export class PlayersViewModel {
  
  constructor(private readonly gameData: GameData) {
    
  }

  getColorForWorld(world: VisibleWorld | null) {
    if (!world || !visibleWorldhasOwner(world)) {
      return 'lightgray'
    } else {
      return this.getColorForPlayer(world.ownerId);
    }
  }

  getColorForPlayer(playerId: string) {
    return this.gameData.playerInfos[playerId]?.color ?? 'lightgray';
  }
}