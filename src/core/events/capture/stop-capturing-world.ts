import { GameEvent, GameEventQueue } from "../event";
import { Observable, combineLatest } from "rxjs";
import { map } from "rxjs/operators";
import { injectable } from "inversify";
import { CombatProjector } from "../../projectors/combat-projector";
import { TimeProjector } from "../../projectors/time-projector";
import { startConversionAtWorld } from "../../actions/world/start-conversion";
import { GameSetupProvider } from "../../game-setup-provider";
import { ConversionProjector } from "../../projectors/conversion-projector";
import deepEqual from "deep-equal";
import { WorldProjector } from "../../projectors/world-projector";
import { calculateNextConversionEvent } from "./conversion-helper";
import { RandomNumberGenerator } from "../../infrastructure/random-number-generator";
import { stopConversionAtWorld } from "../../actions/world/stop-capturing";

@injectable()
export class StopCapturingWorldEventQueue implements GameEventQueue {

  public upcomingEvent$: Observable<GameEvent | null>;

  constructor(
    private setup: GameSetupProvider,
    private conversion: ConversionProjector,
    private worlds: WorldProjector,
    private random: RandomNumberGenerator
  ) {
    this.upcomingEvent$ = combineLatest([
      this.worlds.byId$,
      this.conversion.contestedWorldIds$,
      this.conversion.dominationByWorldId$
    ]).pipe(
      map(([worldsById, contestedWOrldIds, dominationByWorldId]) => {

        const world = Object.values(worldsById).find(world => {
          if (world.captureStatus === 'BEING_CAPTURED' && !contestedWOrldIds.includes(world.id)) {
            return true
          }
        })

        if (!world) {
          return null
        } else {
          return {
            happen: (timestamp: number) => {


              return [
                stopConversionAtWorld(world.id),
              ];
            }
          }
        }
      })
    )
  }
}
