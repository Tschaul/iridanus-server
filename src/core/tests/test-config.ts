import { GameRules } from "../../shared/model/v1/rules";

const tick = 1000;

export const testRules: GameRules = {
  scoring: {
    gameEndingScore: 1000 * tick,
  },
  capture: {
    captureDelay: 2.5 * tick,
  },
  population: {
    minimumPopulationGrowthDelay: 7 * tick
  },
  combat: {
    integrityDamagePerShip: 0.094276,
    populationDamagePerShip: 0.188552,
    meanFiringInterval: 1 * tick,
  },
  visibility: {
    revealPeriod: 3.5 * tick
  },
  building: {
    buildShipDelay: 10 * tick,
  },
  warping: {
    arriveAtEnemyWorldDelay: 1 * tick,
    leaveEnemyWorldDelay: 1 * tick,
    warpToWorldDelay: 1 * tick,
  },
  mining: {
    miningDelay: 3 * tick,
    maximumMetal: 0,
  },
  global: {
    maxAmount: 99
  }
}