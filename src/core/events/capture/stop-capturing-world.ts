import { GameEvent, GameEventQueue } from "../event";
import { Observable, combineLatest } from "rxjs";
import { map } from "rxjs/operators";
import { injectable } from "inversify";
import { ConversionProjector } from "../../projectors/conversion-projector";
import { WorldProjector } from "../../projectors/world-projector";
import { stopConversionAtWorld } from "../../actions/world/stop-capturing";
import { worldHasOwner } from "../../../shared/model/v1/world";

@injectable()
export class StopCapturingWorldEventQueue implements GameEventQueue {

  public upcomingEvent$: Observable<GameEvent | null>;

  constructor(
    private conversion: ConversionProjector,
    private worlds: WorldProjector  ) {
    this.upcomingEvent$ = combineLatest([
      this.worlds.byId$,
      this.conversion.contestedWorldIds$
    ]).pipe(
      map(([worldsById, contestedWOrldIds]) => {

        const world = Object.values(worldsById).find(world => {
          if (worldHasOwner(world) && world.populationConversionStatus.type === 'BEING_CAPTURED' && !contestedWOrldIds.includes(world.id)) {
            return true
          }
        })

        if (!world) {
          return null
        } else {
          return {
            happen: () => {


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
