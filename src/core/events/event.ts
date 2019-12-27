import { GameState } from "../state";
import { Action } from "../actions/action";
import { Observable } from "rxjs";

export interface GameEvent {
    timestamp: number,
    happen(): Action[]
}

export interface GameEventQueue {
    upcomingEvent$: Observable<GameEvent | null>
}