import { GameEvent, GameEventQueue } from "../event";
import { Observable, combineLatest } from "rxjs";
import { map } from "rxjs/operators";
import { injectable } from "inversify";
import { CombatAndCaptureProjector } from "../../projectors/combat-and-capture-projector";
import { TimeProjector } from "../../projectors/time-projector";
import { startCapturingWorld } from "../../actions/world/start-capturing";
import { GameSetupProvider } from "../../game-setup-provider";

@injectable()
export class StartCapturingWorldEventQueue implements GameEventQueue {

  public upcomingEvent$: Observable<GameEvent | null>;

  constructor(
    public capture: CombatAndCaptureProjector,
    public time: TimeProjector,
    setup: GameSetupProvider
  ) {
    this.upcomingEvent$ = this.capture.nextStartCapturingWorld$.pipe(
      map(([world, newOwnerId]) => {
        if (!world) {
          return null
        } else {
          return {
            happen: (timestamp: number) => {

              return [
                startCapturingWorld(world.id, newOwnerId, timestamp + setup.rules.capture.captureDelay),
              ];
            }
          }
        }
      })
    )
  }
}
