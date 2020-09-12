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
    populationDamagePerShip: number;
  },
  building: {
    buildShipDelay: number;
  },
  warping: {
    leaveEnemyWorldDelay: number;
    warpToWorldDelay: number;
    arriveAtEnemyWorldDelay: number;
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