import { GameEventQueue, GameEvent } from "../event";
import { Observable, combineLatest } from "rxjs";
import { injectable } from "inversify";
import { WorldProjector } from "../../projectors/world-projector";
import { TimeProjector } from "../../projectors/time-projector";
import { ReadyWorld, worldHasOwner, WorldWithOwner } from "../../../shared/model/v1/world";
import { map } from "rxjs/operators";
import { giveOrTakeWorldMetal } from "../../actions/world/give-or-take-metal";
import { buildShips } from "../../actions/world/build-ship";
import { GameSetupProvider } from "../../game-setup-provider";

@injectable()
export class BeginBuildingShipEventQueue implements GameEventQueue {
  public upcomingEvent$: Observable<GameEvent | null>;

  constructor(
    private worlds: WorldProjector,
    private setup: GameSetupProvider
  ) {
    const shipsAmount = 5;

    const startBuildingShipsWorld$ = this.worlds.byId$.pipe(
      map((worldsById) => {

        const worlds = Object.values(worldsById);

        return worlds.find(world => {
          if (worldHasOwner(world)) {
            const activeIndustry = Math.min(world.population[world.ownerId], world.industry)
            if (world.buildShipsStatus.type === 'NOT_BUILDING_SHIPS' && activeIndustry > 0 && world.metal >= shipsAmount) {
              return true
            }
          }
        }) as WorldWithOwner

      })
    )

    this.upcomingEvent$ = startBuildingShipsWorld$.pipe(
      map((world) => {

        if (!world) {
          return null
        } else {
          return {
            happen: (timestamp: number) => {
              const activeIndustry = Math.min(world.population[world.ownerId], world.industry)
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