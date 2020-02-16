import { injectable } from "inversify";
import { Logger } from "../../../core/infrastructure/logger";

@injectable()
export class GlobalErrorHandler {
  
  constructor(private logger: Logger) {}

  handleError(error: Error) {
    this.logger.error(error.toString());
  }

  catchPromise(promise: Promise<unknown>) {
    promise.catch(error => this.handleError(error));
  }
}