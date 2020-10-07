import { GameEvent, GameEventQueue } from "../event";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { injectable } from "inversify";
import { WorldProjector } from "../../projectors/world-projector";
import { World, WorldBeingCaptured } from "../../../shared/model/v1/world";
import { giveOrTakeWorldPopulation } from "../../actions/world/give-or-take-population";
import { stopConversionAtWorld } from "../../actions/world/stop-capturing";

@injectable()
export class ConvertPopulationEventQueue implements GameEventQueue {

  public upcomingEvent$: Observable<GameEvent | null>;

  constructor(
    public worlds: WorldProjector,
  ) {

    const nextWorldWithConversionEvent$ = this.worlds.byId$.pipe(
      map((worldsById) => {

        const worlds = Object.values(worldsById);

        return (worlds.filter(world =>
          'captureStatus' in world
          && world.captureStatus === 'BEING_CAPTURED'
        ) as Array<WorldBeingCaptured & World>).sort((a, b) => a.nextConversionTimestamp - b.nextConversionTimestamp)[0] || null
      })
    )


    this.upcomingEvent$ = nextWorldWithConversionEvent$.pipe(
      map((world) => {
        if (!world) {
          return null;
        }
        return {
          timestamp: world.nextConversionTimestamp,
          happen: () => {
            return [
              giveOrTakeWorldPopulation(world.id, -1, world.nextConvertedPlayerId),
              giveOrTakeWorldPopulation(world.id, 1, world.nextConvertingPlayerId),
              stopConversionAtWorld(world.id)
            ]
          }
        }
      })
    )
  }
}

