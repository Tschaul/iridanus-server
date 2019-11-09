import { Universe } from "./model/universe";

export interface State {
    currentTimestamp: number;
    gameEndTimestamp: number;
    universe: Universe;
}