import { randomBytes, createHash } from "crypto";
import { injectable } from "inversify";

@injectable()
export class CryptoWrapper {

  secureRandom(): Promise<string> {
    return new Promise((resolve, reject) => {
      randomBytes(16, function (err, buffer) {
        if (err) {
          reject(err);
        }
        var token = buffer.toString('hex');
        resolve(token);
      });
    })
  }

  hashPassword(password: string, salt: string, pepper: string) {
    return createHash('sha1').update(password + salt + pepper).digest('hex')
  }
}