import { ContainerRegistry } from "./container-registry";
import { SubscriptionHandler } from "./subscriptions/subscription-handler";
import { CommandHandler } from "./commands/command-handler";
import { UserRepository } from "./repositories/users/user-repository";
import { RequestMessage } from "../shared/messages/request-message";
import { ResponseMessage } from "../shared/messages/response-message";
import { GlobalErrorHandler } from "./commands/infrastructure/error-handling/global-error-handler";

import { Initializer } from "./commands/infrastructure/initialisation/initializer";
import { Queue } from "./commands/infrastructure/queue/queue";

export class ConnectionHandler {

  private subscriptionHandler: SubscriptionHandler;
  private commandHandler: CommandHandler;
  private userRepository: UserRepository;
  private globalErrorHandler: GlobalErrorHandler;
  private authenticatedUser: string | null = null;
  queue: Queue;
  initializer: Initializer;

  constructor(private containerRegistry: ContainerRegistry, private sendfn: (reponse: ResponseMessage) => void) {
    this.subscriptionHandler = containerRegistry.globalContainer.get(SubscriptionHandler);
    this.commandHandler = containerRegistry.globalContainer.get(CommandHandler);
    this.userRepository = containerRegistry.globalContainer.get(UserRepository);
    this.globalErrorHandler = containerRegistry.globalContainer.get(GlobalErrorHandler);
    this.initializer = containerRegistry.globalContainer.get(Initializer);

    this.queue = new Queue();
  }

  settleQueue() {
    return new Promise((resolve) => {
      this.queue.add(async () => resolve())
    })
  }

  handleMessage(message: RequestMessage) {

    try {

      switch (message.type) {
        case 'AUTHENTICATE':
          this.queue.add(async () => {
            await this.initializer.initializeAllRequested();
            const authResult =  await  this.userRepository.authenticateUser(message.userId, message.password)
              if (authResult) {
                this.authenticatedUser = message.userId;
                this.sendfn({
                  type: 'AUTHENTICATION_SUCCESSFULL'
                })
              } else {
                this.sendfn({
                  type: 'ERROR',
                  error: 'Authentication was not successfull'
                })
              }
            })
          break;
        case 'BEGIN_SUBSCRIPTION':
          this.subscriptionHandler.newSubscription(
            this.containerRegistry,
            message.subscription,
            message.id,
            message.gameId,
            (data: any) => this.sendfn(data),
          );
          break;
        case 'END_SUBSCRIPTION':
          this.subscriptionHandler.cancelSubscription(message.id);
          break;
        case 'COMMAND':
          this.queue.add(() => this.commandHandler.handleCommand(
            this.containerRegistry,
            message.command,
            message.commandId,
            message.gameId,
            (data: any) => this.sendfn(data),
          ));
          break;
        default:
          break;
      }

    } catch (error) {
      this.globalErrorHandler.handleError(error)
      this.sendfn({
        type: 'ERROR',
        error: error + ''
      })
    }

  }
}