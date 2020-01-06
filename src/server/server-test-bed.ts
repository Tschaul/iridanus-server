import { ContainerRegistry } from "./container-registry";
import { Environment } from "./environment/environment";
import { mkdirSync, rmdirSync } from "fs";
import { ResponseMessage, SubscriptionResponse, CommandResponse, AuthenticationResponse } from "../shared/messages/response-message";
import { ConnectionHandler } from "./connection-handler";
import { RequestMessage } from "../shared/messages/request-message";

import a from 'assertron';

export class ServerTestBed {
  path: string;

  private responses: ResponseMessage[];
  server: ConnectionHandler;

  constructor(private registry: ContainerRegistry) {
    this.path = registry.globalContainer.get(Environment).dataPath;
  }

  logout() {
    this.server.logout();
  }

  async prepare() {
    this.cleanup();
    this.responses = [];
    mkdirSync(this.path, { recursive: true })
    this.server = new ConnectionHandler(this.registry, r => {
      this.responses.unshift(r)
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

  expectSubscriptionResponse(response: SubscriptionResponse) {
    const subscriptionResponse = this.responses.find(r => r.type ==='SUBSCRIPTION_RESULT')
    a.satisfies(subscriptionResponse, response)
  }

  expectCommandResponse(response: CommandResponse) {
    const commandResponse = this.responses.find(r => r.type ==='COMMAND_SUCCESS')
    a.satisfies(commandResponse, response)
  }

  expectAuthenticationResponse(response: AuthenticationResponse) {
    const authResponse = this.responses.find(r => r.type ==='AUTHENTICATION_SUCCESSFULL')
    a.satisfies(authResponse, response)
  }

  latestResponse() {
    return this.responses[0];
  }
}