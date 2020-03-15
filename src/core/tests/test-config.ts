import { GameRules } from "../../shared/model/v1/rules";

const tick = 100;

export const testRules: GameRules = {
  capture: {
    captureDelay: 1 * tick,
  },
  population: {
    minimumPopulationGrowthDelay: 7 * tick
  },
  combat: {
    integrityDamagePerShip: 0.094276,
    meanFiringInterval: 1 * tick,
    industryDamageChancePerShip:  0.023569,
    populationDamageChancePerShip: 0.04713,
  },
  building: {
    buildIndustryDelay: 50 * tick,
    buildShipDelay: 10 * tick,
    buildIndustryCost: 5,
  },
  warping: {
    arriveWorldDelay: 1 * tick,
    leaveWorldDelay: 1 * tick,
    warpToWorldDelay: 1 * tick,
  },
  transfering: {
    transferMetalDelay: 1 * tick,
    transferShipsDelay: 1 * tick,
    transferPopulationDelay: 1 * tick,
  },
  mining: {
    miningDelay: 3 * tick,
    maximumMetal: 0,
  },
  scrapping: {
    scrappingDelay:  1 * tick,
    shipsPerIndustry: 6
  },
  global: {
    maxAmount: 99
  }
}