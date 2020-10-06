import { GameEventQueue, GameEvent } from "../event";
import { Observable, combineLatest } from "rxjs";
import { injectable } from "inversify";
import { WorldProjector } from "../../projectors/world-projector";
import { TimeProjector } from "../../projectors/time-projector";
import { ReadyWorld } from "../../../shared/model/v1/world";
import { map } from "rxjs/operators";
import { giveOrTakeWorldMetal } from "../../actions/world/give-or-take-metal";
import { buildShips } from "../../actions/world/build-ship";
import { GameSetupProvider } from "../../game-setup-provider";

@injectable()
export class BeginBuildingShipEventQueue implements GameEventQueue {
  public upcomingEvent$: Observable<GameEvent | null>;

  constructor(worlds: WorldProjector, private time: TimeProjector, private setup: GameSetupProvider) {
    const shipsAmount = 5;
    this.upcomingEvent$ = worlds.allByStatus<ReadyWorld>('READY').pipe(
      map((worlds) => {
        const world = worlds.find(world => {
          const activeIndustry = Math.min(world.population, world.industry)
          return activeIndustry > 0 && world.metal >= shipsAmount
        })

        if (!world) {
          return null
        } else {
          return {
            happen: (timestamp: number) => {
              const activeIndustry = Math.min(world.population, world.industry)
              const delay = this.setup.rules.building.buildShipDelay * shipsAmount / activeIndustry;
              return [
                buildShips(world.id, timestamp + delay, shipsAmount, activeIndustry),
                giveOrTakeWorldMetal(world.id, -1 * shipsAmount),
              ];

            }
          }
        }
      })
    )
  }
}