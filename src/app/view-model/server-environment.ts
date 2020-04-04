import { resolveFromRegistry } from "../container-registry";
import { IStreamListener, fromStream } from "mobx-utils";
import { empty } from "rxjs";
import { observable, computed } from "mobx";
import { EnvironmentService } from "../client/environment.ts/environment.service";
import { EnvironmentInfo } from "../../shared/messages/subscriptions/environment-subscription-results";

const infoDummy = { millisecondsPerDay: 1 };

export class ServerEnvironment {
  private environmentService = resolveFromRegistry(EnvironmentService);

  @observable private environmentStream: IStreamListener<EnvironmentInfo> = fromStream(empty(), infoDummy);

  constructor() {
  }

  initialize() {
    this.environmentStream = fromStream(this.environmentService.getEnvironmentInfo(), infoDummy);
  }

  @computed get environmentInfo() {
    return this.environmentStream.current;
  }
}