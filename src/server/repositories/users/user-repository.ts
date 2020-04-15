import { UsersSchema, initialData, User, ConfirmedUser, UnconfirmedUser } from "./schema/v1";
import { DataHandle, DataHandleRegistry } from "../data-handle-registry";
import { injectable } from "inversify";
import { CryptoWrapper } from "../../infrastructure/crypto/crypto-wrapper";
import { Initializer } from "../../infrastructure/initialisation/initializer";
import { Clock } from "../../../core/infrastructure/clock";
import { Environment } from "../../environment/environment";

const USER_DATA_PATH = 'users/users.json';

@injectable()
export class UserRepository {

  private handle: DataHandle<UsersSchema>;

  constructor(
    private dataHandleRegistry: DataHandleRegistry,
    private crypto: CryptoWrapper,
    initilaizer: Initializer,
    private clock: Clock,
    private environment: Environment) {
    initilaizer.requestInitialization(this.initialize());
  }

  async initialize() {
    this.handle = await this.dataHandleRegistry.getDataHandle(USER_DATA_PATH);
    await this.handle.createIfMissing(initialData(await this.crypto.secureRandom()))
  }

  async getUserInfos(userIds: string[]): Promise<User[]> {
    const data = await this.handle.read();
    return userIds.map(id => data.users[id])
  }

  async createUser(id: string, email: string, password: string) {
    const token = await this.crypto.secureRandom();
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
          salt,
          emailConfirmed: false,
          emailConfirmationToken: token
        }
      }
    })
    return token;
  }

  async confirmUserEmail(id: string, token: string) {
    await this.handle.do(async (data) => {
      if (!data.users[id]) {
        throw new Error(`user id '${id}' does not exist`)
      }
      const user = data.users[id];
      if (user.emailConfirmed || user.emailConfirmationToken !== token) {
        throw new Error(`email for user id '${id}' could not be confirmed`)
      }
      return (data) => {
        const user = data.users[id] as UnconfirmedUser;
        data.users[id] = {
          emailConfirmed: true,
          email: user.email,
          emailConfirmationTimestamp: this.clock.getTimestamp(),
          id: user.id,
          passwordHash: user.passwordHash,
          salt: user.salt,
          passwordResetToken: '',
          passwortResetTokenValidUntil: 0
        }
      }
    })
  }

  async renewPasswordResetToken(id: string) {
    const token = await this.crypto.secureRandom();
    const timestamp = this.clock.getTimestamp() + this.environment.millisecondsPerDay;
    await this.handle.do(async (data) => {
      if (!data.users[id]) {
        throw new Error(`user id '${id}' does not exist`)
      }
      if (!data.users[id].emailConfirmed) {
        throw new Error(`email for user id '${id}' is not yet activated`)
      }
      return (data) => {
        const user = data.users[id] as ConfirmedUser;
        user.passwordResetToken = token;
        user.passwortResetTokenValidUntil = timestamp;
      }
    })
    return token;
  }

  async resetPassword(id: string, token: string, password: string) {
    const now = this.clock.getTimestamp();
    await this.handle.do(async (data) => {
      if (!data.users[id]) {
        throw new Error(`user id '${id}' does not exist`)
      }
      if (!data.users[id].emailConfirmed) {
        throw new Error(`email for user id '${id}' is not yet activated`)
      }
      const confirmedUser = data.users[id] as ConfirmedUser;
      if (confirmedUser.passwordResetToken !== token || confirmedUser.passwortResetTokenValidUntil < now ) {
        throw new Error(`password reset token for user '${id}' is not valid`)
      }
      const salt = await this.crypto.secureRandom();
      const pepper = data.pepper;
      const passwordHash = this.crypto.hashPassword(password, salt, pepper);
      return (data) => {
        const user = data.users[id] as ConfirmedUser;
        user.passwordResetToken = '';
        user.passwortResetTokenValidUntil = 0;
        user.salt = salt;
        user.passwordHash = passwordHash;
      }
    })
  }

  async authenticateUser(id: string, password: string) {
    const data = await this.handle.read();
    if (!data.users[id] || !data.users[id].emailConfirmed) {
      return false;
    }

    const pepper = data.pepper;
    const passwordHash = this.crypto.hashPassword(password, data.users[id].salt, pepper);

    return passwordHash === data.users[id].passwordHash;
  }

}