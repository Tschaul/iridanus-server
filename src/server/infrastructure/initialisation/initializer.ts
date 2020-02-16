import { injectable } from "inversify";
import { GlobalErrorHandler } from "../error-handling/global-error-handler";

let uniqueId = 0;

@injectable()
export class Initializer {

  constructor(private errorHandler: GlobalErrorHandler){}

  private initializations: Map<number,Promise<void>> = new Map();

  requestInitialization(promise: Promise<void>) {
    const id = uniqueId++;
    this.initializations.set(id, promise);
    promise.then(() => {
      this.initializations.delete(id)
    })
  }

  initializeAllRequested() {
    const all = [...this.initializations.values()];
    this.initializations = new Map();
    return Promise.all(all).catch(error => {
      this.errorHandler.handleError(error);
    });
  }
}