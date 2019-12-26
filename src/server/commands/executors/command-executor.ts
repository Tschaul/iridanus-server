export interface CommandExecutor<T> {
  execute(command: T): Promise<void>
}