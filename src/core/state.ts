import { Universe } from "./model/universe";

export const INITIAL_STATE = Symbol.for("InitialState");

export interface State {
    currentTimestamp: number;
    gameEndTimestamp: number;
    universe: Universe;
}