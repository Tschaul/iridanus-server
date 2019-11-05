import { injectable } from "inversify";
import 'reflect-metadata';

@injectable()
export class Logger {
  log(...msg: any) {
    console.log(...msg)
  }
}

export class TestLogger extends Logger {
  log(...msg: any) {
    return;
  }
}