import { injectable } from "inversify";
import 'reflect-metadata';

@injectable()
export class RandomNumberGenerator {
  public equal() {
    let result = 0;
    while(result === 0) {
      result = Math.random();
    }
    return result;
  }

  public exponential() {
    return -1 * Math.log(this.equal());
  }
}

export class NotSoRandomNumberGenerator extends RandomNumberGenerator {
  public equal() {
    return 0.42;
  }
}