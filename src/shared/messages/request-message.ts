import { Command } from "./commands/commands";
import { Credentials } from "./credentials";
import { Subscription } from "./subscriptions";

export type RequestMessage = {
  type: 'AUTHENTICATE',
  userId: string,
  credentials: Credentials,
  requestId: string
} | {
  type: 'COMMAND',
  command: Command,
  commandId: string,
  gameId?: string | null,
} | {
  type: 'LAST_WILL',
  commands: Command[],
  gameId?: string | null,
} | {
  type: 'BEGIN_SUBSCRIPTION'
  subscription: Subscription,
  id: string,
  gameId?: string | null,
} | {
  type: 'END_SUBSCRIPTION',
  id: string,
}