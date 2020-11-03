import { isArrowFunction } from "typescript";
import { pickFromDistribution, totalAmount } from "../../shared/math/distributions/distribution-helper";
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

function buildBagFromDistribution() {
  let result: WorldType['type'][] = [];
  Object.getOwnPropertyNames(worldTypeDistribution).forEach((type: WorldType['type']) => {
    const amount = worldTypeDistribution[type];
    if (amount > 0) {
      result = [...result, ...Array.from({ length: amount }, () => type)]
    }
  })
  return result;
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

export class WorldTypeBag {

  private bag: WorldType['type'][]
  private index = 0;

  constructor(minSize: number) {

    const distributionTotal = totalAmount(worldTypeDistribution);

    const mult = Math.ceil(minSize / distributionTotal)

    this.bag = Array.from({ length: mult }, () => buildBagFromDistribution()).reduce((acc, v) => {
      return acc.concat(v)
    }, [] as WorldType['type'][])
  }

  next() {
    const type = this.bag[this.index++]
    if (!type) {
      throw Error("Bag of world types is empty!")
    }
    if (type === 'HOME') {
      throw new Error('Home worlds should be distributed before')
    }
    return {
      type
    }
  }
}