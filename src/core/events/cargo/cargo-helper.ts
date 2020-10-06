import { WorldWithOwner } from "../../../shared/model/v1/world";

export function cargoAmounts(
  worldFrom: WorldWithOwner,
  worldTo: WorldWithOwner,
  metalPotential: { [worldId: string]: number },
  ships: number
) {

  const metal = metalCargoAmount(
    metalPotential[worldFrom.id],
    metalPotential[worldTo.id],
    worldFrom.metal,
    ships
  )

  const population = populationCargoAmount(
    ships,
    worldFrom,
    worldTo
  )

  return {
    metal,
    population
  }

}

function metalCargoAmount(
  fromPotential: number,
  toPotential: number,
  worldAmount: number,
  ships: number
) {

  if (toPotential > fromPotential) {
    return Math.min(worldAmount, ships)
  } else return 0;
}

function populationCargoAmount(
  ships: number,
  worldFrom: WorldWithOwner,
  worldTo: WorldWithOwner
) {

  const worldFromPopulation = worldFrom.population[worldFrom.ownerId];
  const worldToPopulation = worldFrom.population[worldTo.ownerId];

  if (worldFromPopulation > (worldToPopulation + 1) && worldFromPopulation > 1) {
    return Math.min(
      Math.round((worldFromPopulation - worldToPopulation - 1) / 2),
      ships,
      worldFromPopulation - 1,
      worldTo.populationLimit - worldToPopulation
    )
  } else {
    return 0;
  }


}

