import * as express from 'express';
import { createServer } from 'http';
import { Server } from 'ws';
import { AddressInfo } from 'net';
import { ContainerRegistry } from './container-registry';
import { ConnectionHandler } from './connection-handler';
import { RequestMessage } from '../shared/messages/request-message';

const app = express();

const server = createServer(app);

const webSocketServer = new Server({ server });

const containerRegistry = new ContainerRegistry();

webSocketServer.on('connection', (socket: WebSocket) => {

  const connectionHandler = new ConnectionHandler(containerRegistry, r => socket.send(JSON.stringify(r)));

  socket.addEventListener('message', (e: MessageEvent) => {
    const message = JSON.parse(e.data) as RequestMessage;
    connectionHandler.handleMessage(message);
  });

  socket.addEventListener('close', () => {
    connectionHandler.dispose();
  })
})

//start our server
server.listen(process.env.PORT || 8999, () => {
  const address = server.address() as AddressInfo;
  console.log(`Server started on port ${address.port} :)`);
});