import { ContainerRegistry } from "../container-registry";
import { Environment } from "../environment/environment";
import { mkdirSync, rmdirSync } from "fs";
import { ResponseMessage, SubscriptionResponse, CommandResponse, AuthenticationResponse, ErrorReponse } from "../../shared/messages/response-message";
import { ConnectionHandler } from "../connection-handler";
import { RequestMessage } from "../../shared/messages/request-message";

import a from 'assertron';
import { DataHandleRegistry } from "../repositories/data-handle-registry";
import { Initializer } from "../infrastructure/initialisation/initializer";
import { AccountConfirmationMessageMock } from "./mocks/mail-mocks";
import { AccountConfirmationMessage } from "../messages/account-confirmation-message";

export class ServerTestBed {
  path: string;

  private responses: ResponseMessage[];
  server: ConnectionHandler;
  dataHandleRegistry: DataHandleRegistry;
  initializer: Initializer;
  accountConfirmationMailMock: AccountConfirmationMessageMock;

  constructor(private registry: ContainerRegistry) {
    this.path = registry.globalContainer.get(Environment).dataPath;
    this.dataHandleRegistry = registry.globalContainer.get(DataHandleRegistry);
    this.initializer = registry.globalContainer.get(Initializer);
    this.accountConfirmationMailMock = registry.globalContainer.get(AccountConfirmationMessage) as any as AccountConfirmationMessageMock;
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
    await this.initializer.initializeAllRequested();
  }

  async putData(path: string, data: any) {
    const handle = await this.dataHandleRegistry.getDataHandle(path);
    await handle.create(data);
  }

  async cleanup() {
    rmdirSync(this.path, { recursive: true })
  }

  async sendMessage(message: RequestMessage) {
    this.server.handleMessage(message);
    await this.server.settleQueue();
    await new Promise(r => setTimeout(r, 0));
  }

  getEmailConfirmationToken(userId: string) {
    return this.accountConfirmationMailMock.tokens.get(userId);
  }

  clearResponses() {
    this.responses = [];
  }

  expectResponse(response: any) {
    a.satisfies(this.latestResponse(), response)
  }

  expectSubscriptionResponse(response: SubscriptionResponse) {
    const subscriptionResponse = this.responses.find(r => r.type === 'SUBSCRIPTION_RESULT')
    a.satisfies(subscriptionResponse, response)
  }

  expectCommandResponse(response: CommandResponse) {
    const commandResponse = this.responses.find(r => r.type === 'COMMAND_SUCCESS')
    a.satisfies(commandResponse, response)
  }

  expectErrorResponse(response: ErrorReponse) {
    const commandResponse = this.responses.find(r => r.type === 'ERROR')
    a.satisfies(commandResponse, response)
  }

  expectAuthenticationResponse(response: AuthenticationResponse) {
    const authResponse = this.responses.find(r => r.type === 'AUTHENTICATION_SUCCESSFULL')
    a.satisfies(authResponse, response)
  }

  latestResponse() {
    return this.responses[0];
  }
}