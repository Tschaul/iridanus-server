import { GameRules } from "../../shared/model/v1/rules";

const oneMinute = 1000 * 60;

export const testConfig: GameRules = {
  combat: {
    integrityDamagePerShip: 0.456789,
    meanFiringInterval: 3 * oneMinute
  },
  building: {
    buildIndustryDelay: 50 * oneMinute,
    buildShipDelay: 10 * oneMinute,
    buildIndustryCost: 5,
  },
  warping: {
    arriveWorldDelay: 1 * oneMinute,
    leaveWorldDelay: 1 * oneMinute,
    warpToWorldDelay: 1 * oneMinute,
  },
  transfering: {
    transferMetalDelay: 1 * oneMinute,
    transferShipsDelay: 1 * oneMinute,
  }
}