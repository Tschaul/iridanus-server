import { GameConfig } from "../config";

const second = 1000;

export const testConfig: GameConfig = {
  combat: {
    integrityDamagePerShip: 0.05,
    meanFiringInterval: 1 * second
  },
  building: {
    buildIndustryDelay: 50 * second,
    buildShipDelay: 10 * second,
    buildIndustryCost: 5,
  },
  warping: {
    arriveWorldDelay: 1 * second,
    leaveWorldDelay: 1 * second,
    warpToWorldDelay: 1 * second,
  },
  transfering: {
    transferMetalDelay: 1 * second,
    transferShipsDelay: 1 * second,
  }
}