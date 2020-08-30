import { World } from "../../../shared/model/v1/world";

export function cargoAmounts(
  worldFrom: World,
  worldTo: World,
  metalPotential: { [worldId: string]: number },
  ships: number
) {

  return {
    metal: metalCargoAmount(
      metalPotential[worldFrom.id],
      metalPotential[worldTo.id],
      worldFrom.metal,
      ships
    ),
    population: 0
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

