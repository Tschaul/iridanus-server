import { GameRules } from "../../shared/model/v1/rules";

// const millisecondsPerDay = 1000 * 5;

export function makeConfig(millisecondsPerDay: number): GameRules {
  return {
    scoring: {
      gameEndingScore: 3500 * millisecondsPerDay
    },
    capture: {
      captureDelay: 2.5 * millisecondsPerDay,
    },
    population: {
      minimumPopulationGrowthDelay: 35 * millisecondsPerDay
    },
    combat: {
      integrityDamagePerShip: 0.094276,
      meanFiringInterval: 1 * millisecondsPerDay,
      industryDamageChancePerShip: 0.023569,
      populationDamageChancePerShip: 0.04713,
    },
    building: {
      buildIndustryDelay: 50 * millisecondsPerDay,
      buildShipDelay: 10 * millisecondsPerDay,
      buildIndustryCost: 5,
    },
    warping: {
      arriveWorldDelay: 1 * millisecondsPerDay,
      leaveWorldDelay: 1 * millisecondsPerDay,
      warpToWorldDelay: 2.5 * millisecondsPerDay,
    },
    transfering: {
      transferMetalDelay: 1 * millisecondsPerDay,
      transferShipsDelay: 1 * millisecondsPerDay,
      transferPopulationDelay: 1 * millisecondsPerDay,
    },
    mining: {
      miningDelay: 3 * millisecondsPerDay,
      maximumMetal: 10
    },
    scrapping: {
      scrappingDelay: 1 * millisecondsPerDay,
      shipsPerIndustry: 6
    },
    global: {
      maxAmount: 99
    }
  }
}