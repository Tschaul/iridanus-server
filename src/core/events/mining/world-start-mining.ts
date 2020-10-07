import { GameEventQueue, GameEvent } from "../event";
import { Observable, combineLatest } from "rxjs";
import { injectable } from "inversify";
import { TimeProjector } from "../../projectors/time-projector";
import { map, withLatestFrom } from "rxjs/operators";
import { WorldProjector } from "../../projectors/world-projector";
import { RandomNumberGenerator } from "../../infrastructure/random-number-generator";
import { worldStartMining } from "../../actions/world/start-mining";
import { CombatProjector } from "../../projectors/combat-projector";
import { GameSetupProvider } from "../../game-setup-provider";
import { worldHasOwner } from "../../../shared/model/v1/world";

@injectable()
export class WorldStartMiningEventQueue implements GameEventQueue {
  public upcomingEvent$: Observable<GameEvent | null>;

  constructor(
    private worlds: WorldProjector,
    private time: TimeProjector,
    private setup: GameSetupProvider) {

    const startMiningWorld$ = this.worlds.byId$.pipe(
      map((worldsById) => {

        const worlds = Object.values(worldsById);

        return worlds.find(world =>
          worldHasOwner(world)
          && world.miningStatus.type === 'NOT_MINING'
          && world.mines > 0
          && world.metal < setup.rules.mining.maximumMetal
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