import { GameEventQueue, GameEvent } from "../event";
import { Observable } from "rxjs";
import { injectable } from "inversify";
import { TimeProjector } from "../../projectors/time-projector";
import { map } from "rxjs/operators";
import { WorldProjector } from "../../projectors/world-projector";
import { worldStartMining } from "../../actions/world/start-mining";
import { GameSetupProvider } from "../../game-setup-provider";
import { worldHasOwner } from "../../../shared/model/v1/world";
import { worldShouldBeMining } from "./mining-helper";

@injectable()
export class WorldStartMiningEventQueue implements GameEventQueue {
  public upcomingEvent$: Observable<GameEvent | null>;

  constructor(
    private worlds: WorldProjector,
    private setup: GameSetupProvider) {

    const startMiningWorld$ = this.worlds.byId$.pipe(
      map((worldsById) => {

        const worlds = Object.values(worldsById);

        return worlds.find(world =>
          worldHasOwner(world)
          && world.miningStatus.type === 'NOT_MINING'
          && worldShouldBeMining(world, setup.rules)
        )
      })
    )

    this.upcomingEvent$ = startMiningWorld$.pipe(
      map((world) => {
        if (!world) {
          return null;
        }
        return {
          happen: (timestamp: number) => {

            const nextMetalMinedTimestamp = timestamp + this.setup.rules.mining.miningDelay / world.mines

            return [
              worldStartMining(world.id, nextMetalMinedTimestamp)
            ]
          }
        }
      })
    )
  }

}