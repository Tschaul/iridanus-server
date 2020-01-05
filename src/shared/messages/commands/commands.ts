import { SignUpUserCommand } from "./user-commands";
import { GameCommand } from "./game-commands";

export type Command =  GameCommand
  | SignUpUserCommand;
