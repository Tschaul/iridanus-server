import * as express from 'express';
import { createServer } from 'http';
import { Server } from 'ws';
import { AddressInfo } from 'net';
import { ContainerRegistry } from './container-registry';
import { SubscriptionHandler } from './subscriptions/subscription-handler';
import { RequestMessage } from '../shared/request-message';
import { CommandHandler } from './commands/command-handler';

const app = express();

//initialize a simple http server
const server = createServer(app);

//initialize the WebSocket server instance
const webSocketServer = new Server({ server });

const containerRegistry = new ContainerRegistry();

const subscriptionHandler = containerRegistry.globalContainer.get(SubscriptionHandler);
const commandHandler = containerRegistry.globalContainer.get(CommandHandler);

webSocketServer.on('connection', (socket: WebSocket) => {

  socket.addEventListener('message', (e: MessageEvent) => {

    try {
      const message = JSON.parse(e.data) as RequestMessage;

      switch (message.type) {
        case 'BEGIN_SUBSCRIPTION':
          subscriptionHandler.newSubscription(
            containerRegistry,
            message.subscription,
            message.id,
            message.gameId,
            (data: any) => socket.send(JSON.stringify(data)),
          );
          break;
        case 'END_SUBSCRIPTION':
          subscriptionHandler.cancelSubscription(message.id);
          break;
        case 'COMMAND':
          commandHandler.handleCommand(
            containerRegistry,
            message.command,
            message.gameId,
            (data: any) => socket.send(JSON.stringify(data)),
          )
          break;
        default:
          break;
      }

    } catch (error) {
      console.error(error)
      // TODO send error
    }

  });

});

//start our server
server.listen(process.env.PORT || 8999, () => {
  const address = server.address() as AddressInfo;
  console.log(`Server started on port ${address.port} :)`);
});