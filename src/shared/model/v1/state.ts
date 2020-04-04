import { Universe } from "./universe";
import { Scorings } from "./scoring";

export interface GameState {
    gameStartTimestamp: number;
    currentTimestamp: number;
    gameEndTimestamp: number;
    universe: Universe;
    scorings: Scorings;
}