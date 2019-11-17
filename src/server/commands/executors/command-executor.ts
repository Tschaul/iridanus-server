import { Command } from "../../../shared/messages/commands";

export interface CommandExecutor {
  execute(command: Command, error: (e: string) => void): void
}