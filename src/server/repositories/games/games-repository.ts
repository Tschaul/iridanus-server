import { injectable } from "inversify";
import { DataHandleRegistry } from "../data-handle-registry";
import { Observable, combineLatest, from, BehaviorSubject, ReplaySubject, NEVER, merge } from "rxjs";
import { GameInfoSchema, GameStateSchema, GameHistorySchema, GameLogSchema, GameMetaDataSchema } from "./schema/v1";
import { take, switchMap, concatMap, map, first, tap, mergeMap } from "rxjs/operators";
import { Initializer } from "../../infrastructure/initialisation/initializer";
import { PlayerInfo } from "../../../shared/model/v1/player-info";
import { normalize } from "../../../shared/math/vec2";
import { GameInfo, StartedGameInfo } from "../../../shared/model/v1/game-info";
import { GameState } from "../../../shared/model/v1/state";
import { Clock } from "../../../core/infrastructure/clock";
import { DrawingPositions } from "../../../shared/model/v1/drawing-positions";

const BASE_FOLDER = 'games'

const infoPathById = (gameId: string) => `${BASE_FOLDER}/${gameId}/info.json`;
const statePathById = (gameId: string) => `${BASE_FOLDER}/${gameId}/state.json`;
const historyPathById = (gameId: string) => `${BASE_FOLDER}/${gameId}/history.json`;
const logPathById = (gameId: string) => `${BASE_FOLDER}/${gameId}/log.json`;
const metaDataPathById = (gameId: string) => `${BASE_FOLDER}/${gameId}/meta-data.json`;

@injectable()
export class GameRepository {

  private _data$: Observable<GameInfo[]>;
  private _gameIds$ = new ReplaySubject<string[]>(1);

  constructor(private dataHandleRegistry: DataHandleRegistry, initializer: Initializer, private clock: Clock) {
    initializer.requestInitialization(this.initialize());
    this._data$ = this._gameIds$.pipe(
      switchMap(gameIds => {
        return combineLatest(
          ...gameIds.map((gameId: string) => merge(from(this.handleForGameInfoById(gameId)), NEVER).pipe(
            concatMap(handle => {
              return handle.asObservable().pipe(
              )
            })
          ))
        )
      }),
      map(schemas => schemas.map(schema => schema.info)),
    )
  }

  private async initialize() {
    const gameIds = await this.dataHandleRegistry.listDirectories(BASE_FOLDER);
    this._gameIds$.next(gameIds);
  }

  private handleForGameInfoById(gameId: string) {
    return this.dataHandleRegistry.getDataHandle<GameInfoSchema>(infoPathById(gameId));
  }

  private handleForGameStateById(gameId: string) {
    return this.dataHandleRegistry.getDataHandle<GameStateSchema>(statePathById(gameId));
  }

  private handleForGameHistoryById(gameId: string) {
    return this.dataHandleRegistry.getDataHandle<GameHistorySchema>(historyPathById(gameId));
  }

  private handleForGameLogById(gameId: string) {
    return this.dataHandleRegistry.getDataHandle<GameLogSchema>(logPathById(gameId));
  }

  private handleForGameMetaDataById(gameId: string) {
    return this.dataHandleRegistry.getDataHandle<GameMetaDataSchema>(metaDataPathById(gameId));
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

  public getGameInfoByIdAsObservable(gameId: string) {
    return from(this.handleForGameInfoById(gameId)).pipe(
      switchMap(handle => {
        return handle.asObservable();
      }),
      map(data => data.info)
    );
  }

  public getGameMetaDataByIdAsObservable(gameId: string) {
    return from(this.handleForGameMetaDataById(gameId)).pipe(
      switchMap(handle => {
        return handle.asObservable();
      }),
      map(data => data.data)
    );
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
    const currentGameIds = await this._gameIds$.pipe(first()).toPromise();
    this._gameIds$.next([...currentGameIds, gameId])
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

  public async getGameState(gameId: string) {
    const handle = await this.handleForGameStateById(gameId);
    const exists = await handle.exists()
    if (!exists) {
      return null;
    } else {
      const data = await handle.read();
      return data.currentState;
    }
  }

  public async setGameState(gameId: string, newState: GameState) {
    const stateHandle = await this.handleForGameStateById(gameId);
    const stateExists = await stateHandle.exists()
    if (!stateExists) {
      await stateHandle.create({
        version: 1,
        currentState: newState,
      })
    } else {
      await stateHandle.do(async () => draft => {
        draft.currentState = newState;
      })
    }

    const historyHandle = await this.handleForGameHistoryById(gameId);
    const historyExists = await historyHandle.exists()
    if (!historyExists) {
      await historyHandle.create({
        version: 1,
        stateHistory: {
          [this.clock.getTimestamp()]: newState
        }
      })
    } else {
      await historyHandle.do(async () => draft => {
        draft.stateHistory[this.clock.getTimestamp()] = newState;
      })
    }
  }

  public async appendGameLog(gameId: string, message: string) {
    const logHandle = await this.handleForGameLogById(gameId);
    const stateExists = await logHandle.exists()
    if (!stateExists) {
      await logHandle.create({
        version: 1,
        actionLog: {
          [this.clock.getTimestamp()]: message
        }
      })
    } else {
      await logHandle.do(async () => draft => {
        draft.actionLog[this.clock.getTimestamp()] = message;
      })
    }
  }

  public async startGame(gameId: string, drawingPositions: DrawingPositions) {
    const handle = await this.handleForGameInfoById(gameId);
    handle.do(async (draft) => {
      if (draft.info.state !== 'PROPOSED') {
        throw new Error("Game has allready started.")
      }
      return draft => {
        const info = draft.info as StartedGameInfo;
        info.state = 'STARTED';
      }
    })
    const metaDataHandle = await this.handleForGameMetaDataById(gameId);
    await metaDataHandle.create({
      version: 1,
      data: { drawingPositions }
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
        color: 'deepskyblue',
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