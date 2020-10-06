import { SocketConnection } from "../socket-connection";
import { injectable } from "inversify";

@injectable()
export class UserManagementService {

  constructor(private connection: SocketConnection) {}

  async login(userId: string, password: string) {
    return await this.connection.authenticate(userId, {
      type: 'password',
      password,
      createToken: true
    });
  }

  async useAuthToken(userId: string, token: string) {
    return await this.connection.authenticate(userId, {
      type: 'token',
      token
    },);
  }

  async logout(userId: string, token: string) {
    return await this.connection.sendCommand({
      type: 'USER/REMOVE_AUTH_TOKEN',
      token
    },);
  }

  async signUp(userId: string, email: string, password: string) {
    await this.connection.sendCommand({
      type: 'USER/SIGN_UP_USER',
      id: userId,
      email,
      password
    })
  }

  async confirmEmail(userId: string, token: string) {
    await this.connection.sendCommand({
      type: 'USER/CONFIRM_EMAIL_ADDRESS',
      id: userId,
      token,
    })
  }

  async forgotPassword(userId: string,) {
    await this.connection.sendCommand({
      type: 'USER/SEND_PASSWORD_RESET_TOKEN',
      id: userId,
    })
  }

  async resetPassword(userId: string, token: string, password: string) {
    await this.connection.sendCommand({
      type: 'USER/RESET_PASSWORD',
      id: userId,
      token,
      password
    })
  }

}