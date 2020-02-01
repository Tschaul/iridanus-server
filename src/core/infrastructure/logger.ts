import { injectable } from "inversify";

@injectable()
export class Logger {

  info(message: string) {
    console.log(message)
  }

  debug(message: string) {
    console.log(message)
  }

  warning(message: string) {
    console.warn(message)
  }

  error(message: string) {
    console.error(message)
  }

}