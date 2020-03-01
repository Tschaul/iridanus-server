import { injectable } from "inversify";
import { ContainerRegistry } from "./container-registry";
import { GameRepository } from "./repositories/games/games-repository";
import { first, debounceTime, pairwise, filter } from "rxjs/operators";
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
import { testConfig } from "../core/setup/simple-config";
import { makeGomeisaThree } from "../util/hex-map/gomeisa-three";

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

    setup.rules = testConfig;

    const currentState = await this.gameRepository.getGameState(gameInfo.id);

    if (!currentState) {

      this.logger.info('game runner: starting game ' + gameInfo.id);

      const map = makeGomeisaThree()

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
      debounceTime(0),
    ).subscribe(message => {
      this.errorHandler.catchPromise(this.gameRepository.appendGameLog(gameInfo.id, message));
    })

    await game.startGameLoop();
  }

  instantiateMap(gameInfo: Readonly<GameInfo>, map: Readonly<GameMap>): GameState {
    const universe = produce(map.universe, (state: Universe) => {
      const players = Object.getOwnPropertyNames(gameInfo.players);
      map.seats.forEach((seat, index) => {
        const player = players[index];
        Object.getOwnPropertyNames(state.worlds).forEach(worldId => {
          const world = state.worlds[worldId];
          if (worldhasOwner(world) && world.ownerId === seat) {
            if (player) {
              world.ownerId = player;
            }  else {
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
            }  else {
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
      gameEndTimestamp: Number.MAX_VALUE,
      universe,
    }
  }

}