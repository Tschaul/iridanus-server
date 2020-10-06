import { ContainerRegistry } from "./container-registry";
import { SubscriptionHandler } from "./subscriptions/subscription-handler";
import { CommandHandler } from "./commands/command-handler";
import { UserRepository } from "./repositories/users/user-repository";
import { RequestMessage } from "../shared/messages/request-message";
import { ResponseMessage } from "../shared/messages/response-message";
import { GlobalErrorHandler } from "./infrastructure/error-handling/global-error-handler";

import { Initializer } from "./infrastructure/initialisation/initializer";
import { Queue } from "./infrastructure/queue/queue";
import { Subject } from "rxjs";
import { RequestMessageValidator } from "./infrastructure/validation/request-message-validator";

export class ConnectionHandler {

  private subscriptionHandler: SubscriptionHandler;
  private commandHandler: CommandHandler;
  private userRepository: UserRepository;
  private globalErrorHandler: GlobalErrorHandler;
  private authenticatedUserId: string | null = null;
  private queue: Queue;
  private initializer: Initializer;
  private hasBeenDisposed$$: Subject<never>;
  private requestMessageValidator: RequestMessageValidator;

  constructor(private containerRegistry: ContainerRegistry, private sendfn: (reponse: ResponseMessage) => void) {
    this.subscriptionHandler = containerRegistry.globalContainer.get(SubscriptionHandler);
    this.commandHandler = containerRegistry.globalContainer.get(CommandHandler);
    this.userRepository = containerRegistry.globalContainer.get(UserRepository);
    this.globalErrorHandler = containerRegistry.globalContainer.get(GlobalErrorHandler);
    this.initializer = containerRegistry.globalContainer.get(Initializer);
    this.requestMessageValidator = containerRegistry.globalContainer.get(RequestMessageValidator);

    this.queue = new Queue();

    this.hasBeenDisposed$$ = new Subject<never>();
  }

  logout() {
    this.authenticatedUserId = null;
  }

  settleQueue() {
    return new Promise((resolve) => {
      this.queue.add(async () => resolve())
    })
  }

  dispose() {
    this.hasBeenDisposed$$.next();
    this.hasBeenDisposed$$.complete();
  }

  handleMessage(message: RequestMessage) {

    try {

      this.requestMessageValidator.assertRequestMessageValid(message);

      switch (message.type) {
        case 'AUTHENTICATE':
          this.queue.add(async () => {
            await this.initializer.initializeAllRequested();
            let authResult = false;
            let token: string | undefined = undefined;
            switch (message.credentials.type) {
              case 'password':
                authResult = await this.userRepository.authenticateUserWithPassword(message.userId, message.credentials.password)
                if (authResult && message.credentials.createToken) {
                  token = await this.userRepository.createToken(message.userId)
                }
                break;
              case 'token':
                authResult = await this.userRepository.authenticateUserWithToken(message.userId, message.credentials.token)
                if (authResult) {
                  await this.userRepository.renewToken(message.userId, message.credentials.token)
                }
                break;
            }
            if (authResult) {
              this.authenticatedUserId = message.userId;
              this.sendfn({
                type: 'AUTHENTICATION_SUCCESSFULL',
                requestId: message.requestId,
                token
              })
            } else {
              this.sendfn({
                type: 'AUTHENTICATION_NOT_SUCCESSFULL',
                requestId: message.requestId
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
            this.authenticatedUserId,
            (data: any) => this.sendfn(data),
            this.hasBeenDisposed$$
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
            this.authenticatedUserId,
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