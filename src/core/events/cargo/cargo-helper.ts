import { World } from "../../../shared/model/v1/world";

export function cargoAmounts(
  worldFrom: World,
  worldToId: string,
  metalPotential: { [worldId: string]: number },
  populationPotential: { [worldId: string]: number },
  ships: number
) {

  return {
    population: cargoAmount(
      populationPotential[worldFrom.id],
      populationPotential[worldToId],
      worldFrom.population,
      ships
    ),
    metal: cargoAmount(
      metalPotential[worldFrom.id],
      metalPotential[worldToId],
      worldFrom.metal,
      ships
    )
  }

}

function cargoAmount(
  fromPotential: number,
  toPotential: number,
  worldAmount: number,
  ships: number
) {

  if (toPotential > fromPotential) {
    return Math.min(worldAmount, ships)
  } else return 0;
}