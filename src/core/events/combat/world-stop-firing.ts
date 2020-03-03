import { GameEventQueue, GameEvent } from "../event";
import { Observable, combineLatest } from "rxjs";
import { injectable } from "inversify";
import { TimeProjector } from "../../projectors/time-projector";
import { map, withLatestFrom } from "rxjs/operators";
import { WorldProjector } from "../../projectors/world-projector";
import { CombatAndCaptureProjector } from "../../projectors/combat-and-capture-projector";
import { worldStopFiring } from "../../actions/world/stop-firing";

@injectable()
export class WorldStopFiringEventQueue implements GameEventQueue {
  public upcomingEvent$: Observable<GameEvent | null>;

  constructor(
    private worlds: WorldProjector,
    private combat: CombatAndCaptureProjector,
    private time: TimeProjector) {
    const stopFiringWorlds$ = combineLatest(this.combat.worldIdsAtPeaceAndAtWar$, this.worlds.byId$).pipe(
      map(([[_, nonCombatWorldIds], worldsById]) => {

        const worlds = Object.values(worldsById);

        return worlds.find(world =>
          world.status === 'READY'
          && nonCombatWorldIds.indexOf(world.id) !== -1
          && world.combatStatus === 'FIRING'
        )
      })
    )

    this.upcomingEvent$ = combineLatest(
      stopFiringWorlds$,
      this.time.currentTimestamp$
    ).pipe(
      map(([world, timestamp]) => {
        if (!world) {
          return null;
        }
        return {
          timestamp,
          happen: () => {

            return [
              worldStopFiring(world.id)
            ]
          }
        }
      })
    )
  }

}