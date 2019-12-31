import { injectable } from "inversify";

@injectable()
export class GlobalErrorHandler {
  handleError(error: Error) {
    console.error(error);
  }

  catchPromise(promise: Promise<unknown>) {
    promise.catch(error => this.handleError(error));
  }
}