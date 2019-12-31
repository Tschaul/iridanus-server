import { injectable } from "inversify";

@injectable()
export class CryptoWrapperMock {

  secureRandom(): Promise<string> {
    return Promise.resolve('1234')
  }

  hashPassword(password: string, salt: string, pepper: string) {
    return password + salt + pepper;
  }
}