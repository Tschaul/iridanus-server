import { GameState } from "../../shared/model/v1/state";
import { Action } from "../actions/action";
import { Observable } from "rxjs";
import { GameNotification } from "../../shared/model/v1/notification";

export interface GameEvent {
    endsGame?: boolean,
    notifications?: (timestamp: number) => GameNotification[],
    timestamp?: number,
    happen(timestamp: number): Action[]
}

export interface GameEventQueue {
    upcomingEvent$: Observable<GameEvent | null>
}