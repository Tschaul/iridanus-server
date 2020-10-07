import { World } from "../../../shared/model/v1/world";

export function cargoAmounts(
  worldFrom: World,
  worldTo: World,
  metalPotential: { [worldId: string]: number },
  ships: number,
  playerId: string
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
    worldTo,
    playerId
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
  worldFrom: World,
  worldTo: World,
  playerId: string
) {

  const worldFromPopulation = worldFrom.population[playerId] ?? 0;
  const worldToPopulation = worldTo.population[playerId] ?? 0;

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

