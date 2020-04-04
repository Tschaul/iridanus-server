import { SocketConnection } from "../socket-connection";
import { injectable } from "inversify";

@injectable()
export class UserManagementService {

  constructor(private connection: SocketConnection) {}

  async login(userId: string, password: string) {
    await this.connection.authenticate(userId, password);
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