import { GameRuleSet } from "../../../../shared/model/v1/rules";

export interface RulesSchema {
  version: 1;
  data: GameRuleSet;
}