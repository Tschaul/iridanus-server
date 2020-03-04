import { GameRules } from "../../shared/model/v1/rules";

const tick = 100;

export const testRules: GameRules = {
  combat: {
    integrityDamagePerShip: 0.456789,
    meanFiringInterval: 5 * tick
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