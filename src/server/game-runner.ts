import { injectable } from "inversify";
import { ContainerRegistry } from "./container-registry";
import { GameRepository } from "./repositories/games/games-repository";
import { first, debounceTime, pairwise, filter, withLatestFrom } from "rxjs/operators";
import { Game } from "../core/game";
import { GlobalErrorHandler } from "./infrastructure/error-handling/global-error-handler";
import { GameSetupProvider } from "../core/game-setup-provider";
import { Store } from "../core/store";
import { GameInfo } from "../shared/model/v1/game-info";
import { GameMap } from "../shared/model/v1/game-map";
import { GameState } from "../shared/model/v1/state";
import produce from "immer";
import { worldhasOwner, LostWorld, baseWorld } from "../shared/model/v1/world";
import { fleetHasOwner, baseFleet, ReadyFleet } from "../shared/model/v1/fleet";
import { Clock } from "../core/infrastructure/clock";
import { Logger } from "../core/infrastructure/logger";
import { Universe } from "../shared/model/v1/universe";
import { Initializer } from "./infrastructure/initialisation/initializer";
import { debugConfig } from "../core/setup/simple-config";
import { makeGomeisaThreeRandom } from "../util/hex-map/gomeisa-three-random";
import { Scorings } from "../shared/model/v1/scoring";

@injectable()
export class GameRunner {

  private readonly gameRepository: GameRepository;
  private readonly errorHandler: GlobalErrorHandler;
  private readonly clock: Clock;
  private readonly logger: Logger;
  private readonly initializer: Initializer;

  constructor(
    private registry: ContainerRegistry,
  ) {
    this.gameRepository = registry.globalContainer.get(GameRepository);
    this.errorHandler = registry.globalContainer.get(GlobalErrorHandler);
    this.clock = registry.globalContainer.get(Clock);
    this.logger = registry.globalContainer.get(Logger);
    this.initializer = registry.globalContainer.get(Initializer);
  }

  run() {

    this.initializer.initializeAllRequested().then(() => {

      this.logger.debug('game runner runs');
      this.gameRepository.allGameInfosAsObservable().pipe(
        first(),
      ).subscribe(gameInfos => {
        this.logger.debug('games found ' + gameInfos.length);
        gameInfos.forEach(gameInfo => {
          this.logger.debug('game found ' + gameInfo.id);
          if (gameInfo.state === 'STARTED') {
            this.errorHandler.catchPromise(this.runGame(gameInfo));
          }
        });
      })

      this.gameRepository.allGameInfosAsObservable().pipe(
        pairwise(),
      ).subscribe(([oldGameInfos, newGameInfos]) => {
        newGameInfos.forEach(newGameInfo => {
          if (this.gameShouldStart(newGameInfo)) {
            const oldGame = oldGameInfos.find(info => info.id === newGameInfo.id);
            if (!this.gameShouldStart(oldGame)) {
              this.logger.debug('new game just started' + newGameInfo.id);
              this.errorHandler.catchPromise(this.runGame(newGameInfo));
            }
          }
        });
      })
    })
  }

  private gameShouldStart(game: GameInfo | undefined): boolean {
    return !!game
      && game.state === 'PROPOSED'
      && !Object.values(game.players).some(player => player.state !== 'READY')
      && Object.values(game.players).length > 1;
  }

  async runGame(gameInfo: GameInfo) {
    const container = this.registry.getContainerByGameId(gameInfo.id);
    const game = container.get(Game);
    const setup = container.get(GameSetupProvider);
    const store = container.get(Store);

    setup.rules = debugConfig;

    const currentState = await this.gameRepository.getGameState(gameInfo.id);

    if (!currentState) {

      this.logger.info('game runner: starting game ' + gameInfo.id);

      const map = makeGomeisaThreeRandom()

      const state = this.instantiateMap(gameInfo, map);

      await this.gameRepository.startGame(gameInfo.id, map.drawingPositions);

      setup.initialState = state;

    } else {

      this.logger.info('game runner: resuming game ' + gameInfo.id);
      setup.initialState = currentState
    }

    await store.initialize();

    store.state$.pipe(
      debounceTime(0),
    ).subscribe(newState => {
      this.errorHandler.catchPromise(this.gameRepository.setGameState(gameInfo.id, newState));
    })

    store.actionLog$.pipe(
      withLatestFrom(store.state$)
    ).subscribe(([message, state]) => {
      this.errorHandler.catchPromise(this.gameRepository.appendGameLog(gameInfo.id, message, state.currentTimestamp));
    })

    // store.commit();

    await game.startGameLoop();

    this.logger.info('game runner: game ' + gameInfo.id + ' has ended');

    await this.gameRepository.endGame(gameInfo.id)

  }

  instantiateMap(gameInfo: Readonly<GameInfo>, map: Readonly<GameMap>): GameState {
    const players = Object.getOwnPropertyNames(gameInfo.players);

    const scorings: Scorings = {};

    players.forEach(playerId => {
      scorings[playerId] = {
        influence: 0,
        lastScoringTimestamp: 0,
        playerId,
        score: 0
      }
    })

    const universe = produce(map.universe, (state: Universe) => {
      map.seats.forEach((seat, index) => {
        const player = players[index];
        state.visibility[player] = {};
        Object.getOwnPropertyNames(state.worlds).forEach(worldId => {
          const world = state.worlds[worldId];
          if (worldhasOwner(world) && world.ownerId === seat) {
            if (player) {
              world.ownerId = player;
            } else {
              state.worlds[worldId] = {
                status: 'LOST',
                ...baseWorld(world)
              }
            }
          }
        })
        Object.getOwnPropertyNames(state.fleets).forEach(fleetId => {
          const fleet = state.fleets[fleetId];
          if (fleetHasOwner(fleet) && fleet.ownerId === seat) {
            if (player) {
              fleet.ownerId = player;
            } else {
              state.fleets[fleetId] = {
                status: 'LOST',
                ...baseFleet(fleet),
                currentWorldId: (fleet as ReadyFleet).currentWorldId
              }
            }
          }
        })
      })
    })

    return {
      currentTimestamp: this.clock.getTimestamp(),
      gameEndTimestamp: this.clock.getTimestamp() + 1000 * 60 * 60 * 24,
      universe,
      scorings
    }
  }

}