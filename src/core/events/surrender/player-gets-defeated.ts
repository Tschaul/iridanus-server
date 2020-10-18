import { GameEvent, GameEventQueue } from "../event";
import { combineLatest, Observable, of } from "rxjs";
import { map, switchMap } from "rxjs/operators";
import { FleetProjector } from "../../projectors/fleet-projector";
import { injectable } from "inversify";
import { WorldProjector } from "../../projectors/world-projector";
import { PlayerProjector } from "../../projectors/player-projector";
import { defeatPlayer } from "../../actions/player/defeat-player";
import { worldHasOwner } from "../../../shared/model/v1/world";

@injectable()
export class PlayerGetsDefeatedEventQueue implements GameEventQueue {

  public upcomingEvent$: Observable<GameEvent | null>;

  constructor(
    public players: PlayerProjector,
    public fleets: FleetProjector,
    public worlds: WorldProjector,
  ) {
    const nextDefeatedPlayer$ = combineLatest([
      this.players.byId$,
      this.worlds.homeWorldsByPlayerId$
    ]).pipe(
      map(([playersById, homeWorldsByPlayerId]) => {

        const player = Object.values(playersById).find(it => {
          const homeWorld = homeWorldsByPlayerId[it.playerId];
          return it.status === 'PLAYING' && homeWorld && (!worldHasOwner(homeWorld) || homeWorld.ownerId !== it.playerId)
        });

        return player ?? null;

      }))

    this.upcomingEvent$ = nextDefeatedPlayer$.pipe(
      switchMap(player => {
        if (!player) {
          return of(null);
        }
        const playerId = player.playerId;
        return of({
          notifications: (timestamp: number) => [{
            type: 'HOME_WORLD_LOST' as 'HOME_WORLD_LOST',
            playerId: playerId,
            timestamp
          }],
          happen() {
            return [defeatPlayer(playerId)]
          }
        })
      })
    )
  }
}
