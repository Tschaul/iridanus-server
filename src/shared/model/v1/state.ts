import { Universe } from "./universe";
import { PlayerStates } from "./player-state";

export interface GameState {
    gameStartTimestamp: number;
    currentTimestamp: number;
    gameEndTimestamp: number;
    universe: Universe;
    players: PlayerStates;
}