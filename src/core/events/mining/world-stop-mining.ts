import { GameEventQueue, GameEvent } from "../event";
import { Observable, combineLatest } from "rxjs";
import { injectable } from "inversify";
import { TimeProjector } from "../../projectors/time-projector";
import { map, withLatestFrom } from "rxjs/operators";
import { WorldProjector } from "../../projectors/world-projector";
import { worldStopMining } from "../../actions/world/stop-mining";
import { GameSetupProvider } from "../../game-setup-provider";

@injectable()
export class WorldStopMiningEventQueue implements GameEventQueue {
  public upcomingEvent$: Observable<GameEvent | null>;

  constructor(
    private worlds: WorldProjector,
    private time: TimeProjector,
    private setup: GameSetupProvider
  ) {

    const stopMiningWorld$ = this.worlds.byId$.pipe(
      map((worldsById) => {

        const worlds = Object.values(worldsById);

        return worlds.find(world =>
          'miningStatus' in world
          && world.miningStatus === 'MINING'
          && world.metal >= setup.rules.mining.maximumMetal
        )
      })
    )

    this.upcomingEvent$ = stopMiningWorld$.pipe(
      map((world) => {
        if (!world) {
          return null;
        }
        return {
          happen: () => {
            return [
              worldStopMining(world.id)
            ]
          }
        }
      })
    )
  }

}