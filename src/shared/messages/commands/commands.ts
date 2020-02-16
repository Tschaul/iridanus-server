import { SignUpUserCommand } from "./user-commands";
import { GameCommand } from "./game-commands";
import { OrderCommand } from "./order-commands";

export type Command =  GameCommand
  | SignUpUserCommand
  | OrderCommand;
