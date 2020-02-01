import { injectable } from "inversify";
import { Action } from "../actions/action";
import { Logger } from "./logger";

@injectable()
export class ActionLogger {

  constructor(private logger: Logger){}

  logAction(action: Action) {
    this.logger.info(action.describe())
  }
}

export class TestLogger extends ActionLogger {
  logAction(action: Action) {
    return;
  }
}