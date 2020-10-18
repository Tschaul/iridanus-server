import { pickFromDistribution } from "../../shared/math/distributions/distribution-helper";
import { WorldType } from "../../shared/model/v1/world-type";

const worldTypeDistribution: {
  [k in WorldType['type']]: number
} = {
  HOME: 0,
  CREEP: 1,
  DEFENSIVE: 1,
  DOUBLE: 1,
  INDUSTRIAL: 1,
  INSPIRING: 1,
  LUSH: 1,
  MINING: 1,
  NEBULA: 1,
  POPULATED: 1,
  REGULAR: 1,
  VOID: 1,
}

export function choseWorldType(random: number): WorldType {
  const type = pickFromDistribution(worldTypeDistribution, random) as WorldType['type'];

  if (type === 'HOME') {
    throw new Error('Home worlds should be distributed before')
  }

  return {
    type
  }

}