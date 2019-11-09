import { injectable } from "inversify";
import 'reflect-metadata';
import { Command } from "../../shared/commands";

@injectable()
export class CommandHandler {
  constructor() {}

  public handleCommand(command: Command) {
    console.log('handeling command', JSON.stringify(command));
  }
}