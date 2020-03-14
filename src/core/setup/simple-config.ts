import { GameRules } from "../../shared/model/v1/rules";

const fiveSeconds = 1000 * 5;

export const debugConfig: GameRules = {
  population: {
    minimumPopulationGrowthDelay: 7 * fiveSeconds
  },
  combat: {
    integrityDamagePerShip: 0.456789,
    meanFiringInterval: 3 * fiveSeconds
  },
  building: {
    buildIndustryDelay: 50 * fiveSeconds,
    buildShipDelay: 10 * fiveSeconds,
    buildIndustryCost: 5,
  },
  warping: {
    arriveWorldDelay: 1 * fiveSeconds,
    leaveWorldDelay: 1 * fiveSeconds,
    warpToWorldDelay: 2.5 * fiveSeconds,
  },
  transfering: {
    transferMetalDelay: 1 * fiveSeconds,
    transferShipsDelay: 1 * fiveSeconds,
    transferPopulationDelay: 1 * fiveSeconds,
  },
  mining: {
    miningDelay: 3 * fiveSeconds,
    maximumMetal: 10
  },
  scrapping: {
    scrappingDelay:  1 * fiveSeconds,
    shipsPerIndustry: 6
  },
  global: {
    maxAmount: 99
  }
}