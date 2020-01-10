export interface CommandExecutor<T> {
  authenticationRequired: boolean;
  execute(command: T, userId: string | null): Promise<void>
}