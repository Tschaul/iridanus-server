import { GameRules } from "../../shared/model/v1/rules";

export function makeConfig(millisecondsPerDay: number): GameRules {
  return {
    scoring: {
      gameEndingScore: 3000 * millisecondsPerDay
    },
    capture: {
      populationConversionRate: 3.5 * millisecondsPerDay,
      shipConversionMultiplier: 5,
    },
    population: {
      minimumPopulationGrowthDelay: 10 * millisecondsPerDay
    },
    visibility: {
      revealPeriod: 3.5 * millisecondsPerDay
    },
    combat: {
      integrityDamagePerShip: 0.094276,
      populationDamagePerShip: 0.377104,
      meanFiringInterval: 0.25 * millisecondsPerDay,
    },
    building: {
      buildShipDelay: 10 * millisecondsPerDay,
    },
    warping: {
      arriveAtEnemyWorldDelay: 0.3 * millisecondsPerDay,
      leaveEnemyWorldDelay: 0.3 * millisecondsPerDay,
      warpToWorldDelay: 0.7 * millisecondsPerDay,
    },
    mining: {
      miningDelay: 0.5 * millisecondsPerDay,
      maximumMetal: 20
    },
    global: {
      maxAmount: 99
    }
  }
}