import { injectable } from "inversify";
import { GlobalErrorHandler } from "../error-handling/global-error-handler";

@injectable()
export class Initializer {

  constructor(private errorHandler: GlobalErrorHandler){}

  private initializations: Array<Promise<void>> = [];

  requestInitialization(promise: Promise<void>) {
    this.initializations.push(promise);
  }

  initializeAllRequested() {
    const all = this.initializations;
    this.initializations = [];
    return Promise.all(all).catch(error => {
      this.errorHandler.handleError(error);
    });
  }
}