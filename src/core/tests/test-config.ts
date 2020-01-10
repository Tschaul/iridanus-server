import { GameRules } from "../../shared/model/v1/rules";

const second = 1000;

export const simpleRules: GameRules = {
  combat: {
    integrityDamagePerShip: 0.456789,
    meanFiringInterval: 3 * second
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