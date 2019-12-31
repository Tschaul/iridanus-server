import { UsersSchema, initialData } from "./schema/v1";
import { DataHandle, DataHandleRegistry } from "../data-handle-registry";
import { injectable } from "inversify";
import { GlobalErrorHandler } from "../../commands/infrastructure/error-handling/global-error-handler";
import { CryptoWrapper } from "../../commands/infrastructure/crypto/crypto-wrapper";
import { Initializer } from "../../commands/infrastructure/initialisation/initializer";

const USER_DATA_PATH ='users/users.json';

@injectable()
export class UserRepository {

  private handle: DataHandle<UsersSchema>;

  constructor(dataHandleRegistry: DataHandleRegistry, private crypto: CryptoWrapper, private initilaizer: Initializer) {
    this.handle = dataHandleRegistry.getDataHandle(USER_DATA_PATH);
    initilaizer.requestInitialization(this.initialize());
  }

  async initialize() {
    await this.handle.createIfMissing(initialData(await this.crypto.secureRandom()))
  }

  async createUser(id: string, email: string, password: string) {
    await this.handle.do(async (data) => {
      if (data.users[id]) {
        throw new Error(`user id '${id}' is allready taken`)
      }
      const salt = await this.crypto.secureRandom();
      const pepper = data.pepper;
      const passwordHash = this.crypto.hashPassword(password, salt, pepper);
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
    const passwordHash = this.crypto.hashPassword(password, data.users[id].salt, pepper);

    return passwordHash === data.users[id].passwordHash;
  }

}