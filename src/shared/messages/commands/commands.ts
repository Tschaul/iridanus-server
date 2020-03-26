import { SignUpUserCommand } from "./user-commands";
import { GameCommand } from "./game-commands";
import { OrderCommand } from "./order-commands";
import { NotificationCommand } from "./notification-commands";

export type Command =  GameCommand
  | SignUpUserCommand
  | OrderCommand
  | NotificationCommand;
