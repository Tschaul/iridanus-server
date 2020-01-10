import { injectable } from "inversify";
import { DataHandleRegistry } from "../data-handle-registry";
import { Observable, combineLatest, from, BehaviorSubject } from "rxjs";
import { GameInfoSchema } from "./schema/v1";
import { take, switchMap, concatMap, map } from "rxjs/operators";
import { Initializer } from "../../commands/infrastructure/initialisation/initializer";
import { PlayerInfo } from "../../../shared/model/v1/player-info";
import { normalize } from "../../../shared/math/vec2";
import { GameInfo } from "../../../shared/model/v1/game-info";

const BASE_FOLDER = 'games'

const pathById = (gameId: string) => `${BASE_FOLDER}/${gameId}/games.json`;

@injectable()
export class GameRepository {

  private _data$: Observable<GameInfo[]>;
  private _gameIds$ = new BehaviorSubject<string[]>([]);

  constructor(private dataHandleRegistry: DataHandleRegistry, initializer: Initializer) {
    initializer.requestInitialization(this.initialize());
    this._data$ = this._gameIds$.pipe(
      switchMap(gameIds => {
        return combineLatest(
          gameIds.map((gameId: string) => from(this.handleForGameInfoById(gameId)).pipe(
            concatMap(handle => handle.asObservable())
          ))
        )
      }),
      map(schemas => schemas.map(schema => schema.info))
    )
  }

  private async initialize() {
    const gameIds = await this.dataHandleRegistry.listDirectories(BASE_FOLDER);
    this._gameIds$.next(gameIds);
  }

  private handleForGameInfoById(gameId: string) {
    return this.dataHandleRegistry.getDataHandle<GameInfoSchema>(pathById(gameId));
  }

  public getAllGameInfos() {
    return this._data$.pipe(take(1)).toPromise();
  }

  public allGameInfosAsObservable() {
    return this._data$;
  }

  public async getGameInfoById(gameId: string) {
    const handle = await this.handleForGameInfoById(gameId);
    return await handle.read();
  }

  public async createGame(gameId: string) {
    const handle = await this.handleForGameInfoById(gameId);
    await handle.create({
      version: 1,
      info: {
        id: gameId,
        state: 'PROPOSED',
        players: {}
      }
    })
    const currentGameIds = this._gameIds$.value;
    this._gameIds$.next([...currentGameIds, gameId])
  }

  public async setRules(gameId: string, rulesId: string) {
    const handle = await this.handleForGameInfoById(gameId);
    handle.do(async () => {
      return draft => {
        draft.info.rulesId = rulesId;
      }
    })
  }

  public async setMap(gameId: string, mapId: string) {
    const handle = await this.handleForGameInfoById(gameId);
    handle.do(async () => {
      return draft => {
        draft.info.mapId = mapId;
      }
    })
  }

  public async joinGame(gameId: string, playerId: string) {
    const handle = await this.handleForGameInfoById(gameId);
    handle.do(async (draft) => {
      if (draft.info.state !== 'PROPOSED') {
        throw new Error("Game has allready started.")
      }
      const count = Object.getOwnPropertyNames(draft.info.players).length + 1;
      return draft => {
        draft.info.players[playerId] = {
          state: 'JOINED',
          name: playerId,
          ...getPlayerTemplate(count)
        } as PlayerInfo;
      }
    })
  }

  public async setReady(gameId: string, playerId: string) {
    const handle = await this.handleForGameInfoById(gameId);
    handle.do(async (draft) => {
      if (draft.info.state !== 'PROPOSED') {
        throw new Error("Game has allready started.")
      }
      if (!draft.info.players[playerId]) {
        throw new Error("Player has not joined the game yet.")
      }
      return draft => {
        draft.info.players[playerId].state = 'READY'
      }
    })
  }
}

function getPlayerTemplate(num: number): Partial<PlayerInfo> {
  switch (num) {
    case 1:
      return {
        color: 'red',
        fleetDrawingPosition: normalize({ x: -1, y: -1 })
      }
    case 2:
      return {
        color: 'mediumblue',
        fleetDrawingPosition: normalize({ x: 1, y: -1 })
      }
    case 3:
      return {
        color: 'mediumseagreen',
        fleetDrawingPosition: normalize({ x: 1, y: 1 })
      }
    default:
      return {
        color: 'yellow',
        fleetDrawingPosition: normalize({ x: -1, y: 1 })
      }
  }
}