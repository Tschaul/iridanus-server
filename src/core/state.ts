import { Universe } from "./model/universe";


export interface State {
    currentTimestamp: number;
    counter: number;
    universe: Universe;
}