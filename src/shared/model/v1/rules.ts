export interface GameRules {
  global: {
    maxAmount: number;
  },
  combat: {
    meanFiringInterval: number;
    integrityDamagePerShip: number;
  },
  building: {
    buildIndustryCost: number;
    buildIndustryDelay: number;
    buildShipDelay: number;
  },
  transfering: {
    transferMetalDelay: number;
    transferShipsDelay: number;
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
  scrapping: {
    shipsPerIndustry: number;
    scrappingDelay: number;
  }
}

export interface GameRuleSet {
  id: string;
  name: string;
  rules: GameRules;
  final: boolean;
}