import { World } from "../../../shared/model/v1/world";

export function cargoAmounts(
  worldFrom: World,
  worldTo: World,
  metalPotential: { [worldId: string]: number },
  ships: number,
  theoretical: boolean
) {

  const metal = metalCargoAmount(
    metalPotential[worldFrom.id],
    metalPotential[worldTo.id],
    worldFrom.metal,
    ships
  )

  const theoreticalPopulation = theoreticalPopulationCargoAmount(
    worldFrom,
    worldTo,
    ships
  )

  const populationCargoFactor = theoretical
    ? 1
    : Math.random()

  const population = Math.round(populationCargoFactor * theoreticalPopulation)

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

function theoreticalPopulationCargoAmount(
  worldFrom: World,
  worldTo: World,
  ships: number,
) {

  const worldFromCapacity = worldFrom.populationLimit - worldFrom.population;
  const worldToCapacity = worldTo.populationLimit - worldTo.population;

  if (worldFromCapacity >= worldToCapacity) {
    return 0;
  }

  const equilibriumCapacity = Math.floor((worldToCapacity + worldFromCapacity) / 2)

  const maxPassangers = (equilibriumCapacity - worldFromCapacity)

  return Math.min(maxPassangers, ships, worldFrom.population - 1)
}

