import { GameEvent, GameEventQueue } from "./event";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { TimeProjector } from "../projectors/time-projector";
import { injectable } from "inversify";

@injectable()
export class TickEventQueue implements GameEventQueue {
    public upcomingEvent$: Observable<GameEvent | null>;

    constructor(
        private time: TimeProjector,
    ){
        this.upcomingEvent$ = this.time.currentTimestampNew$.pipe(
            map(currentTimestamp => {
                const nextTick = Math.floor(currentTimestamp / 1000) * 1000 + 1000;
                return {
                    timestamp: nextTick,
                    happen: () => {
                      return [
                      ];
                    }
                  }
            })
        )
    }

}