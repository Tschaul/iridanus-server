import { GameEventQueue } from "./event";

export interface GameSystem {
    key: string,
    queue: GameEventQueue
}