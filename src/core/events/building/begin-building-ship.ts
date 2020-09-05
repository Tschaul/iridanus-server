import { GameEventQueue, GameEvent } from "../event";
import { Observable, combineLatest } from "rxjs";
import { injectable } from "inversify";
import { WorldProjector } from "../../projectors/world-projector";
import { TimeProjector } from "../../projectors/time-projector";
import { ReadyWorld } from "../../../shared/model/v1/world";
import { map } from "rxjs/operators";
import { giveOrTakeWorldMetal } from "../../actions/world/give-or-take-metal";
import { buildShip } from "../../actions/world/build-ship";
import { GameSetupProvider } from "../../game-setup-provider";

@injectable()
export class BeginBuildingShipEventQueue implements GameEventQueue {
  public upcomingEvent$: Observable<GameEvent | null>;

  constructor(worlds: WorldProjector, private time: TimeProjector, private setup: GameSetupProvider) {
    this.upcomingEvent$ = combineLatest(
      worlds.allByStatus<ReadyWorld>('READY'),
      this.time.currentTimestamp$
    ).pipe(
      map(([worlds, timestamp]) => {

        const world = worlds.find(world => {
          const builtShips = Math.min(world.population, world.industry, world.metal)
          return builtShips > 0
        })

        if (!world) {
          return null
        } else {
          return {
            timestamp,
            happen: () => {
              

              const builtShips = Math.min(world.population, world.industry, world.metal)
              return [
                buildShip(world.id, timestamp + this.setup.rules.building.buildShipDelay, builtShips),
                giveOrTakeWorldMetal(world.id, -1 * builtShips),
              ];

            }
          }
        }
      })
    )
  }
}