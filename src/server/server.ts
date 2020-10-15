import express from 'express';
import { createServer } from 'http';
import { Server } from 'ws';
import { AddressInfo } from 'net';
import { ContainerRegistry } from './container-registry';
import { ConnectionHandler } from './connection-handler';
import { RequestMessage } from '../shared/messages/request-message';
import { GameRunner } from './game-runner';
import { createProxyServer } from 'http-proxy'
import { shutdown } from './shutdown';
import { createTestGame } from './create-test-game';

import './infrastructure/message-sending/telegram-bot'

const app = express();

if (process.env.IRIDANUS_USE_PROXY === 'true') {
  const apiProxy = createProxyServer();
  app.all("/*", (req, res) => {
    apiProxy.web(req, res, { target: 'http://localhost:9000' });
  });
} else {
  app.use(express.static('dist'));

}


const server = createServer(app);

const webSocketServer = new Server({ server });

const containerRegistry = new ContainerRegistry();

const gameRunner = new GameRunner(containerRegistry);

gameRunner.run();

if (process.env.IRIDANUS_CREATE_TEST_GAME === 'true') {
  setTimeout(() => {
    createTestGame(containerRegistry)
  }, 3000)
}

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
server.listen(process.env.IRIDANUS_SERVER_PORT || 8999, () => {
  const address = server.address() as AddressInfo;
  console.log(`Server started on port ${address.port} :)`);
});

process.on('SIGTERM', () => {
  shutdown(server, containerRegistry)
});

process.on('SIGINT', () => {
  shutdown(server, containerRegistry)
});

