import { User, UsersSchema, initialData } from "./schema/v1";
import { DataHandle, DataHandleRegistry } from "../data-handle-registry";
import { randomBytes, createHash } from "crypto";
import { injectable } from "inversify";

const USER_DATA_PATH ='users/users.json';

@injectable()
export class UserRepository {

  private handle: DataHandle<UsersSchema>;

  constructor(dataHandleRegistry: DataHandleRegistry) { 
    this.handle = dataHandleRegistry.getDataHandle(USER_DATA_PATH);
    this.initialize().catch(console.error);
  }

  async initialize() {
    await this.handle.createIfMissing(initialData(await secureRandom()))
  }

  async createUser(id: string, email: string, password: string) {
    return this.handle.do(async (data) => {
      if (data.users[id]) {
        throw new Error(`user id '${id}' is allready taken`)
      }
      const salt = await secureRandom();
      const pepper = data.pepper;
      const passwordHash = hashPassword(password, salt, pepper);
      return (data) => {
        data.users[id] = {
          email,
          id,
          passwordHash,
          salt
        }
      }
    })
  }

  async authenticateUser(id: string, password: string) {
    const data = await this.handle.read();
    if (!data.users[id]) {
      return false;
    }

    const pepper = data.pepper;
    const passwordHash = hashPassword(password, data.users[id].salt, pepper);

    return passwordHash === data.users[id].passwordHash;
  }

}

function secureRandom(): Promise<string> {
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

function hashPassword(password: string, salt: string, pepper: string) {
  return createHash('sha1').update(password + salt + pepper).digest('hex')
}