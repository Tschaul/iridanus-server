import { Universe } from "./universe";
import { PlayerStates } from "./scoring";

export interface GameState {
    gameStartTimestamp: number;
    currentTimestamp: number;
    gameEndTimestamp: number;
    universe: Universe;
    players: PlayerStates;
}