import { UsersSchema, initialData } from "./schema/v1";
import { DataHandle, DataHandleRegistry } from "../data-handle-registry";
import { injectable } from "inversify";
import { CryptoWrapper } from "../../commands/infrastructure/crypto/crypto-wrapper";
import { Initializer } from "../../commands/infrastructure/initialisation/initializer";

const USER_DATA_PATH ='users/users.json';

@injectable()
export class UserRepository {

  private handle: DataHandle<UsersSchema>;

  constructor(private dataHandleRegistry: DataHandleRegistry, private crypto: CryptoWrapper, initilaizer: Initializer) {
    initilaizer.requestInitialization(this.initialize());
  }

  async initialize() {
    this.handle = await this.dataHandleRegistry.getDataHandle(USER_DATA_PATH);
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