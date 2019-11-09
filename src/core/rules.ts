export interface GameRules {
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
  }
}