import { GameEventQueue, GameEvent } from "../event";
import { Observable } from "rxjs";
import { injectable } from "inversify";
import { map } from "rxjs/operators";
import { worldStartMining } from "../../actions/world/start-mining";
import { GameSetupProvider } from "../../game-setup-provider";
import { WorldProjector } from "../../projectors/world-projector";
import { MiningWorld, BaseWorld, worldHasOwner, WorldWithOwner } from "../../../shared/model/v1/world";
import { giveOrTakeWorldMetal } from "../../actions/world/give-or-take-metal";

@injectable()
export class WorldMinesMetalEventQueue implements GameEventQueue {
  public upcomingEvent$: Observable<GameEvent | null>;

  constructor(
    private worlds: WorldProjector,
    private setup: GameSetupProvider) {

    const nextMiningWorld$ = this.worlds.byId$.pipe(
      map((worldsById) => {

        const worlds = Object.values(worldsById);

        return (worlds.filter(world =>
          worldHasOwner(world)
          && world.miningStatus.type === 'MINING'
        ) as Array<WorldWithOwner & { miningStatus: MiningWorld }>).sort((a, b) => a.miningStatus.nextMetalMinedTimestamp - b.miningStatus.nextMetalMinedTimestamp)[0] || null
      })
    )

    this.upcomingEvent$ = nextMiningWorld$.pipe(
      map((world) => {
        if (!world) {
          return null;
        }
        return {
          timestamp: world.miningStatus.nextMetalMinedTimestamp,
          happen: () => {

            const weaponsReadyTimestamp = world.miningStatus.nextMetalMinedTimestamp + this.setup.rules.mining.miningDelay / world.mines


            return [
              giveOrTakeWorldMetal(world.id, 1),
              worldStartMining(world.id, weaponsReadyTimestamp)
            ]
          }
        }
      })
    )
  }

}

