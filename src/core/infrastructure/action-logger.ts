import { injectable } from "inversify";
import { Action } from "../actions/action";
import { Logger } from "./logger";

@injectable()
export class ActionLogger {

  constructor(private logger: Logger) { }

  logAction(action: Action) {
    this.logger.info('Action: ' + action.describe())
  }
}

export class SilentLogger extends ActionLogger {
  logAction(action: Action) {
    return;
  }
}