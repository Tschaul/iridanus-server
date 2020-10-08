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
import { worldHasOwner } from "../shared/model/v1/world";
import { Clock } from "../core/infrastructure/clock";
import { Logger } from "../core/infrastructure/logger";
import { Universe } from "../shared/model/v1/universe";
import { Initializer } from "./infrastructure/initialisation/initializer";
import { makeConfig } from "../core/setup/simple-config";
import { makeGomeisaThreeRandom } from "../util/hex-map/gomeisa-three-random";
import { PlayerStates } from "../shared/model/v1/scoring";
import { NotificationHandler } from "../core/infrastructure/notification-handler";
import { Environment } from "./environment/environment";
import { NotificationMailer } from "./mails/notification-mail-handler";
import { GameIsReadyMail } from "./mails/game-is-ready-mail";

@injectable()
export class GameRunner {

  private readonly gameRepository: GameRepository;
  private readonly errorHandler: GlobalErrorHandler;
  private readonly clock: Clock;
  private readonly logger: Logger;
  private readonly initializer: Initializer;
  private readonly environment: Environment;
  private readonly gameIsReadyMail: GameIsReadyMail;

  constructor(
    private registry: ContainerRegistry,
  ) {
    this.gameRepository = registry.globalContainer.get(GameRepository);
    this.errorHandler = registry.globalContainer.get(GlobalErrorHandler);
    this.clock = registry.globalContainer.get(Clock);
    this.logger = registry.globalContainer.get(Logger);
    this.initializer = registry.globalContainer.get(Initializer);
    this.environment = registry.globalContainer.get(Environment);
    this.gameIsReadyMail = registry.globalContainer.get(GameIsReadyMail);
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
              this.logger.debug('new game just started ' + newGameInfo.id);
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
    const notificationHandler = container.get(NotificationHandler);
    const notificationMailer = container.get(NotificationMailer);

    setup.rules = makeConfig(this.environment.millisecondsPerDay);

    const currentState = await this.gameRepository.getGameState(gameInfo.id);

    if (!currentState) {

      this.logger.info('game runner: starting game ' + gameInfo.id);

      const map = makeGomeisaThreeRandom()

      const state = this.instantiateMap(gameInfo, map);

      await this.gameRepository.startGame(gameInfo.id, map.drawingPositions);

      await this.gameIsReadyMail.send(gameInfo, state.gameStartTimestamp);

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

    notificationHandler.notifications$.subscribe(notification => {
      this.errorHandler.catchPromise(this.gameRepository.appendNotification(gameInfo.id, notification));
    })

    notificationMailer.start();

    await game.startGameLoop();

    notificationMailer.stop();

    this.logger.info('game runner: game ' + gameInfo.id + ' has ended');

    await this.gameRepository.endGame(gameInfo.id)

  }

  private instantiateMap(gameInfo: Readonly<GameInfo>, map: Readonly<GameMap>): GameState {

    const currentTimestamp = this.clock.getTimestamp();
    const gameStartTimestamp = currentTimestamp + this.environment.millisecondsPerDay * 1;
    const gameEndTimestamp = gameStartTimestamp + this.environment.millisecondsPerDay * 8 * 7;

    const players = Object.values(gameInfo.players)
      .filter(player => !player.isSpectator)
      .map(player => player.id);

    const scorings: PlayerStates = {};

    players.forEach(playerId => {
      scorings[playerId] = {
        influence: 0,
        lastScoringTimestamp: 0,
        playerId,
        score: 0
      }
    })

    let universe = produce(map.universe, (state: Universe) => {

      map.seats.forEach((seat, index) => {
        const player = players[index];
        Object.getOwnPropertyNames(state.fleets).forEach(fleetId => {
          const fleet = state.fleets[fleetId];
          if (fleet.ownerId === seat) {
            if (player) {
              fleet.ownerId = player;
            }
          }
        })
        Object.getOwnPropertyNames(state.worlds).forEach(worldId => {
          const world = state.worlds[worldId];
          if (worldHasOwner(world) && world.ownerId === seat) {
            if (player) {
              world.population[player] = world.population[seat];
              delete world.population[seat];
              world.ownerId = player;
              world.worldHasBeenDiscovered = true;
            }
          }
        })
      })
    })

    return {
      currentTimestamp,
      gameStartTimestamp,
      gameEndTimestamp,
      universe,
      players: scorings
    }
  }

}