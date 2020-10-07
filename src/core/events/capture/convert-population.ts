import { GameEvent, GameEventQueue } from "../event";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { injectable } from "inversify";
import { WorldProjector } from "../../projectors/world-projector";
import { World, WorldBeingCaptured, WorldWithOwner } from "../../../shared/model/v1/world";
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
          world.status === 'OWNED'
          && world.populationConversionStatus.type === 'BEING_CAPTURED'
        ) as Array<WorldWithOwner & { populationConversionStatus: WorldBeingCaptured }>).sort((a, b) =>
          a.populationConversionStatus.nextConversionTimestamp - b.populationConversionStatus.nextConversionTimestamp)[0] || null
      })
    )


    this.upcomingEvent$ = nextWorldWithConversionEvent$.pipe(
      map((world) => {
        if (!world) {
          return null;
        }
        return {
          timestamp: world.populationConversionStatus.nextConversionTimestamp,
          happen: () => {
            return [
              giveOrTakeWorldPopulation(world.id, -1, world.populationConversionStatus.nextConvertedPlayerId),
              giveOrTakeWorldPopulation(world.id, 1, world.populationConversionStatus.nextConvertingPlayerId),
              stopConversionAtWorld(world.id)
            ]
          }
        }
      })
    )
  }
}

