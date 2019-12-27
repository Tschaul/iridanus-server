import { GameRules } from "../../../../core/rules";

export interface RulesSchema {
  version: 1;
  id: string;
  name: string;
  rules: GameRules;
}