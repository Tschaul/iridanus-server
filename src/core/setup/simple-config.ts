import { GameRules } from "../../shared/model/v1/rules";

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
      populationDamagePerShip: 0.188552,
      meanFiringInterval: 1 * millisecondsPerDay,
    },
    building: {
      buildShipDelay: 35 * millisecondsPerDay,
    },
    warping: {
      arriveAtEnemyWorldDelay: 1 * millisecondsPerDay,
      leaveEnemyWorldDelay: 1 * millisecondsPerDay,
      warpToWorldDelay: 2.5 * millisecondsPerDay,
    },
    mining: {
      miningDelay: 7 * millisecondsPerDay,
      maximumMetal: 10
    },
    global: {
      maxAmount: 99
    }
  }
}