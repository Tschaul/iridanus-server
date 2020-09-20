import { combineLatest, Observable } from "rxjs";
import { map } from "rxjs/operators";
import { injectable } from "inversify";
import { GameEvent, GameEventQueue } from "../event";
import { TimeProjector } from "../../projectors/time-projector";
import { GameSetupProvider } from "../../game-setup-provider";
import { VisibilityProjector } from "../../projectors/visibility-projector";
import { Action } from "../../actions/action";
import { rememberWorld } from "../../actions/world/remeber";

@injectable()
export class RevealAllWorldsEventQueue implements GameEventQueue {
    public upcomingEvent$: Observable<GameEvent | null>;

    constructor(
        private time: TimeProjector,
        private config: GameSetupProvider,
        private visibility: VisibilityProjector
    ) {
        this.upcomingEvent$ = combineLatest([
            this.time.currentTimestampNew$,
            this.time.gameStartTimestamp$,
            this.visibility.worldsToRememberFromGlobalRevelationByPlayerId$
        ]).pipe(
            map(([currentTimestamp, gameStartTimestamp, worldsToRemember]) => {
                const period = this.config.rules.visibility.revealPeriod;
                const timeSinceStart = currentTimestamp - gameStartTimestamp
                const nextTick = Math.floor(timeSinceStart / period) * period + period;
                return {
                    timestamp: nextTick + gameStartTimestamp,
                    happen: () => {

                        const actions: Action[] = [];

                        for (const playerId of Object.getOwnPropertyNames(worldsToRemember)) {
                            for (const worldId of worldsToRemember[playerId]) {
                                actions.push(
                                    rememberWorld(worldId, playerId)
                                )
                            }
                        }

                        return actions;
                    }
                }
            })
        )
    }

}