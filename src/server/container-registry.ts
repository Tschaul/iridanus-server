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
import { registerMails } from './mails/register-mails';
import { Environment } from './environment/environment';

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
    registerMails(this.globalContainer);
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

      registerGameCommandExecutors(container);
      registerEventQueues(container);
      registerProjectors(container);
      registerGameDataProviders(container);

      this.containersByGameId.set(gameId, container);

      return container;
    }
  }

}