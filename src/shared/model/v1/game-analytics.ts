import { Distribution } from "../../math/distributions/distribution-helper";

export type AnalyticsCurveItem = {
  timestamp: number,
  population: Distribution,
  industry: Distribution,
  ships: Distribution,
  metal: Distribution,
}

export interface GameAnalytics {
  curve: AnalyticsCurveItem[]
}