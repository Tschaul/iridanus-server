export interface CommandExecutor<T> {
  execute(command: T, userId: string | null): Promise<void>
}