import { World } from "../../../shared/model/v1/world";

export function cargoAmounts(
  worldFrom: World,
  worldTo: World,
  metalPotential: { [worldId: string]: number },
  populationPotential: { [worldId: string]: number },
  ships: number
) {

  const metal = metalCargoAmount(
    metalPotential[worldFrom.id],
    metalPotential[worldTo.id],
    worldFrom.metal,
    ships
  )

  const population = populationCargoAmount(
    populationPotential[worldFrom.id],
    populationPotential[worldTo.id],
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
  fromPotential: number,
  toPotential: number,
  ships: number,
  worldFrom: World,
  worldTo: World
) {

  // const potentialDifference = Math.round(toPotential - fromPotential)

  // if (potentialDifference > 0) {
  //   return Math.min(
  //     ships,
  //     (worldTo.populationLimit - worldTo.population),
  //     worldFrom.population,
  //     potentialDifference
  //   )
  // } else return 0;

  if (worldFrom.population > (worldTo.population + 1) && worldFrom.population > 1) {
    return Math.min(
      Math.round((worldFrom.population - worldTo.population - 1) / 2),
      ships,
      worldFrom.population - 1,
      worldTo.populationLimit - worldTo.population
    )
  } else {
    return 0;
  }


}

