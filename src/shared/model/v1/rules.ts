export interface GameRules {
  scoring: {
    gameEndingScore: number;
  },
  capture: {
    captureDelay: number;
  },
  population: {
    minimumPopulationGrowthDelay: number;
  },
  global: {
    maxAmount: number;
  },
  combat: {
    meanFiringInterval: number;
    integrityDamagePerShip: number;
  },
  building: {
    buildShipDelay: number;
  },
  warping: {
    leaveWorldDelay: number;
    warpToWorldDelay: number;
    arriveWorldDelay: number;
  },
  mining: {
    miningDelay: number;
    maximumMetal: number;
  },
}

export interface GameRuleSet {
  id: string;
  name: string;
  rules: GameRules;
  final: boolean;
}