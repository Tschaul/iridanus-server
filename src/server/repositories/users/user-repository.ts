import { UsersSchema, initialData, User, ConfirmedUser, UnconfirmedUser } from "./schema/v1";
import { DataHandle, DataHandleRegistry } from "../data-handle-registry";
import { injectable } from "inversify";
import { CryptoWrapper } from "../../infrastructure/crypto/crypto-wrapper";
import { Initializer } from "../../infrastructure/initialisation/initializer";
import { Clock } from "../../../core/infrastructure/clock";
import { Environment } from "../../environment/environment";
import { makeId, makePin } from "../../../app/client/make-id";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";

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

  getUserInfo(userId: string): Observable<User | null> {
    return this.handle.asObservable().pipe(map(data => data.users[userId] ?? null))
  }

  async getUserInfos(userIds: string[]): Promise<User[]> {
    const data = await this.handle.read();
    return userIds.map(id => data.users[id])
  }

  async getUserInfoAsObservable(userIds: string[]): Promise<User[]> {
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
          emailConfirmationToken: token,
          authTokens: []
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
          passwortResetTokenValidUntil: 0,
          authTokens: [],
          telegram: {
            confirmed: false,
            code: makePin()
          }
        }
      }
    })
  }

  async confirmUserTelegram(id: string, code: string, chatId: number) {
    await this.handle.do(async (data) => {
      if (!data.users[id]) {
        throw new Error(`user id '${id}' does not exist`)
      }
      const user = data.users[id];
      if (!user.emailConfirmed || user.telegram.confirmed || user.telegram.code !== code) {
        throw new Error(`telegram for user id '${id}' could not be confirmed`)
      }
      return (data) => {
        const user = data.users[id] as ConfirmedUser;
        data.users[id] = {
          ...user,
          telegram: {
            confirmed: true,
            chatId
          }
        }
      }
    })
  }

  async unconfirmUserTelegram(chatId: number) {
    await this.handle.do(async (data) => {

      const user = Object.values(data.users).find(it => it.emailConfirmed && it.telegram.confirmed && it.telegram.chatId === chatId)

      if (!user) {
        throw new Error("No user found for given chat id");
      }

      const id = user.id;

      return (data) => {
        const user = data.users[id] as ConfirmedUser;
        data.users[id] = {
          ...user,
          telegram: {
            confirmed: false,
            code: makePin()
          }
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
      if (confirmedUser.passwordResetToken !== token || confirmedUser.passwortResetTokenValidUntil < now) {
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

  async authenticateUserWithPassword(id: string, password: string) {
    const data = await this.handle.read();
    if (!data.users[id] || !data.users[id].emailConfirmed) {
      return false;
    }

    const pepper = data.pepper;
    const passwordHash = this.crypto.hashPassword(password, data.users[id].salt, pepper);

    return passwordHash === data.users[id].passwordHash;
  }

  async authenticateUserWithToken(id: string, token: string) {
    const data = await this.handle.read();
    if (!data.users[id] || !data.users[id].emailConfirmed) {
      return false;
    }

    const user = data.users[id];

    const authToken = user.authTokens.find(it => it.name === token);

    if (!authToken || authToken.validUntil < this.clock.getTimestamp()) {
      return false;
    }
    return true;
  }

  async renewToken(id: string, token: string) {

    await this.handle.do(async (data) => {
      if (!data.users[id]) {
        throw new Error(`user id '${id}' does not exist`)
      }
      if (!data.users[id].emailConfirmed) {
        throw new Error(`email for user id '${id}' is not yet activated`)
      }
      if (!data.users[id].authTokens.some(it => it.name === token)) {
        throw new Error(`token '${token}' for user id '${id}' not found`)
      }
      return (data) => {
        const user = data.users[id] as ConfirmedUser;
        const authToken = user.authTokens.find(it => it.name === token);
        authToken!.validUntil = this.clock.getTimestamp() + this.environment.tokenExpirePeriod;
      }
    })
  }

  async createToken(id: string) {

    const token = makeId();

    await this.handle.do(async (data) => {
      if (!data.users[id]) {
        throw new Error(`user id '${id}' does not exist`)
      }
      if (!data.users[id].emailConfirmed) {
        throw new Error(`email for user id '${id}' is not yet activated`)
      }
      return (data) => {
        const user = data.users[id] as ConfirmedUser;
        user.authTokens.push({
          name: token,
          validUntil: this.clock.getTimestamp() + this.environment.tokenExpirePeriod
        })
      }
    })

    return token;
  }

  async removeToken(id: string, token: string) {

    await this.handle.do(async (data) => {
      if (!data.users[id]) {
        throw new Error(`user id '${id}' does not exist`)
      }
      if (!data.users[id].emailConfirmed) {
        throw new Error(`email for user id '${id}' is not yet activated`)
      }
      return (data) => {
        const user = data.users[id] as ConfirmedUser;
        user.authTokens = user.authTokens.filter(it => it.name !== token);
      }
    })

    return token;
  }

}