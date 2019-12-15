import { Command } from "./commands";
import { Subscription } from "./subscriptions";

export type RequestMessage = {
  type: 'COMMAND',
  command: Command,
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