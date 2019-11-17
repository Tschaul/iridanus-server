import { Universe } from "../shared/model/universe";

export interface State {
    currentTimestamp: number;
    gameEndTimestamp: number;
    universe: Universe;
}