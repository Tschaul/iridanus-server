import { GameRules } from "../../shared/model/v1/rules";

export function makeConfig(millisecondsPerDay: number): GameRules {
  return {
    scoring: {
      gameEndingScore: 400,
    },
    capture: {
      populationConversionRate: 0.25 * millisecondsPerDay,
      shipConversionMultiplier: 3,
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
      arriveAtEnemyWorldDelay: 0.15 * millisecondsPerDay,
      leaveEnemyWorldDelay: 0.15 * millisecondsPerDay,
      warpToWorldDelay: 0.7 * millisecondsPerDay,
    },
    mining: {
      miningDelay: 2 * millisecondsPerDay,
      maximumMetal: 20
    },
    global: {
      maxAmount: 99
    }
  }
}