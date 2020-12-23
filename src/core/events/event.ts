import { GameState } from "../../shared/model/v1/state";
import { Action } from "../actions/action";
import { combineLatest, Observable } from "rxjs";
import { GameNotification } from "../../shared/model/v1/notification";
import { map } from "rxjs/operators";

export interface GameEvent {
    endsGame?: boolean,
    notifications?: (timestamp: number) => GameNotification[],
    timestamp?: number,
    happen(timestamp: number): Action[]
}

export interface GameEventQueue {
    upcomingEvent$: Observable<GameEvent | null>
}

export function combineEventQueues(queues: GameEventQueue[]) {
    return combineLatest([
        ...queues.map(queue => {
            return queue.upcomingEvent$
        })
    ]).pipe(
        map((events) => {
            return events.reduce((acc, event) => {
                if (event === null) {
                    return acc;
                } else if (acc === null) {
                    return event;
                } else if (acc.timestamp && !event.timestamp) {
                    return event;
                } else if (acc.timestamp && event.timestamp && event.timestamp < acc.timestamp) {
                    return event;
                } else {
                    return acc;
                }
            }, null as GameEvent | null)
        }),
    )
}