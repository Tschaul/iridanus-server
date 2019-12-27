import { Universe } from "../shared/model/v1/universe";

export interface GameState {
    currentTimestamp: number;
    gameEndTimestamp: number;
    universe: Universe;
}