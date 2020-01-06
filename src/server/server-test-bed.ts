import { ContainerRegistry } from "./container-registry";
import { Environment } from "./environment/environment";
import { mkdirSync, rmdirSync } from "fs";
import { ResponseMessage } from "../shared/messages/response-message";
import { ConnectionHandler } from "./connection-handler";
import { RequestMessage } from "../shared/messages/request-message";
import { expect } from "chai";

import a from 'assertron';

export class ServerTestBed {
  path: string;

  private responses: ResponseMessage[];
  server: ConnectionHandler;

  constructor(private registry: ContainerRegistry) {
    this.path = registry.globalContainer.get(Environment).dataPath;
  }

  async prepare() {
    this.cleanup();
    this.responses = [];
    mkdirSync(this.path, { recursive: true })
    this.server = new ConnectionHandler(this.registry, r => {
      this.responses.push(r)
    })
  }

  async cleanup() {
    rmdirSync(this.path, { recursive: true })
  }

  async sendMessage(message: RequestMessage) {
    this.server.handleMessage(message);
    await this.server.settleQueue();
  }

  clearResponses() {
    this.responses = [];
  }

  expectResponse(response: any) {
    a.satisfies(this.latestResponse(), response)
  }

  latestResponse() {
    return this.responses[this.responses.length - 1];
  }
}