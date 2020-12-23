import 'reflect-metadata';
import { Container, injectable } from "inversify";
import { CommandHandler } from "./commands/command-handler";
import { SubscriptionHandler } from "./subscriptions/subscription-handler";
import { Clock } from "../core/infrastructure/clock";
import { ActionLogger } from "../core/infrastructure/action-logger";
import { RandomNumberGenerator } from "../core/infrastructure/random-number-generator";
import { Store, ReadonlyStore } from "../core/store";
import { Game } from "../core/game";
import { registerEventQueues } from "../core/events/register-queues";
import { registerProjectors } from "../core/projectors/register-projectors";
import { registerGlobalDataProviders, registerGameDataProviders } from "./subscriptions/providers/register-data-providers";
import { GameSetupProvider } from "../core/game-setup-provider";
import { registerGameCommandExecutors, registerGlobalCommandExecutors } from './commands/executors/register-command-executors';
import { registerRepositories } from './repositories/register-repositories';
import { registerEnvironment } from './environment/register-environment';
import { registerGlobalInfrastructure } from './infrastructure/register-infrastructure';
import { registerCoreInfrastructure } from '../core/infrastructure/register-core-infrastructure';
import { registerMessages, registerGameMailHandler } from './messages/register-messages';
import { Environment } from './environment/environment';
import { makeConfig } from '../core/setup/simple-config';
import { BUILDING_SYSTEM_KEY } from '../core/events/building/building.system';
import { CAPTURE_SYSTEM_KEY } from '../core/events/capture/capture.system';
import { CARGO_SYSTEM_KEY } from '../core/events/cargo/cargo.system';
import { COMBAT_SYSTEM_KEY } from '../core/events/combat/combat.system';
import { DEPLOY_SYSTEM_KEY } from '../core/events/deploy/deploy.system';
import { FLEET_GROUPING_SYSTEM_KEY } from '../core/events/fleet-grouping/fleet-grouping.system';
import { MINING_SYSTEM_KEY } from '../core/events/mining/mining.system';
import { NOTIFY_SYSTEM_KEY } from '../core/events/notification/notification.system';
import { POPULATION_SYSTEM_KEY } from '../core/events/population/population.system';
import { SCORING_SYSTEM_KEY } from '../core/events/scoring/scoring.system';
import { SURRENDER_SYSTEM_KEY } from '../core/events/surrender/surrender.system';
import { WARPING_SYSTEM_KEY } from '../core/events/warping/warping.system';

@injectable()
export class ContainerRegistry {

  public globalContainer: Container;
  private containersByGameId = new Map<string, Container>();

  constructor(environment?: Environment) {

    this.globalContainer = new Container({
      defaultScope: "Singleton"
    });

    this.globalContainer.bind(CommandHandler).toSelf();
    this.globalContainer.bind(SubscriptionHandler).toSelf();

    registerCoreInfrastructure(this.globalContainer);
    registerGlobalInfrastructure(this.globalContainer);
    registerMessages(this.globalContainer);
    registerGlobalDataProviders(this.globalContainer);
    registerGlobalCommandExecutors(this.globalContainer);
    registerRepositories(this.globalContainer);

    if(!environment) {
      registerEnvironment(this.globalContainer);
    } else {
      this.globalContainer.bind(Environment).toConstantValue(environment);
    }
  }

  public getContainerByGameId(gameId: string | null | undefined): Container {

    if (!gameId) {
      return this.globalContainer;
    }

    if (this.containersByGameId.has(gameId)) {

      return this.containersByGameId.get(gameId) as Container;

    } else {

      const container = new Container({
        defaultScope: "Singleton",
      });

      container.parent = this.globalContainer;

      container.bind(Store).toSelf();
      container.bind(ReadonlyStore).toSelf();
      container.bind(Game).toSelf();
      container.bind(GameSetupProvider).toSelf();

      const setup =  container.get(GameSetupProvider);

      setup.gameId = gameId;

      const env = container.get(Environment);

      setup.rules = makeConfig(env.millisecondsPerDay);

      setup.activeSystems = [
        BUILDING_SYSTEM_KEY,
        CAPTURE_SYSTEM_KEY,
        CARGO_SYSTEM_KEY,
        COMBAT_SYSTEM_KEY,
        DEPLOY_SYSTEM_KEY,
        FLEET_GROUPING_SYSTEM_KEY,
        MINING_SYSTEM_KEY,
        NOTIFY_SYSTEM_KEY,
        POPULATION_SYSTEM_KEY,
        SCORING_SYSTEM_KEY,
        SURRENDER_SYSTEM_KEY,
        WARPING_SYSTEM_KEY,
      ]

      registerGameCommandExecutors(container);
      registerEventQueues(container);
      registerProjectors(container);
      registerGameDataProviders(container);
      registerGameMailHandler(container);

      this.containersByGameId.set(gameId, container);

      return container;
    }
  }

}