import { Universe } from "./universe";

export interface GameState {
    currentTimestamp: number;
    gameEndTimestamp: number;
    universe: Universe;
}