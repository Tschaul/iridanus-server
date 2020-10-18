import { GameEvent, GameEventQueue } from "../event";
import { Observable, combineLatest, of } from "rxjs";
import { map, switchMap } from "rxjs/operators";
import { ReadyFleet } from "../../../shared/model/v1/fleet";
import { FleetProjector } from "../../projectors/fleet-projector";
import { injectable } from "inversify";
import { DeployToWorldOrder } from "../../../shared/model/v1/fleet-orders";
import { popFleetOrder } from "../../actions/fleet/pop-fleet-order";
import { WorldProjector } from "../../projectors/world-projector";
import { worldHasOwner } from "../../../shared/model/v1/world";
import { giveOrTakeWorldIndustry } from "../../actions/world/give-or-take-industry";
import { looseFleet } from "../../actions/fleet/loose-fleet";
import { PlayerProjector } from "../../projectors/player-projector";
import { Action } from "../../actions/action";
import { defeatPlayer } from "../../actions/player/defeat-player";

@injectable()
export class PlayerSurrendersEventQueue implements GameEventQueue {

  public upcomingEvent$: Observable<GameEvent | null>;

  constructor(
    public players: PlayerProjector,
    public fleets: FleetProjector,
    public world: WorldProjector,
  ) {
    const nextSurrenderingPlayer = this.players.byId$.pipe(
      map((playersById) => {

        const player = Object.values(playersById).find(it => it.status === 'PLAYING' && it.hasSurrendered);

        return player ?? null;

      }))

    this.upcomingEvent$ = nextSurrenderingPlayer.pipe(
      switchMap(player => {
        if (!player) {
          return of(null);
        }
        const playerId = player.playerId;
        return of({
          happen() {
            return [defeatPlayer(playerId)]
          }
        })
      })
    )
  }
}
