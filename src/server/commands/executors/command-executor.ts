import { Command } from "../../../shared/commands";

export interface CommandExecutor {
  execute(command: Command, error: (e: string) => void): void
}