import { injectable } from "inversify";
import 'reflect-metadata';
import { Action } from "../actions/action";

@injectable()
export class Logger {
  logAction(action: Action) {
    console.log(action.describe())
  }
}

export class TestLogger extends Logger {
  logAction(action: Action) {
    return;
  }
}