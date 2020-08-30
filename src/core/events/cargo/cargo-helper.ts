import { World } from "../../../shared/model/v1/world";
import { ReadyFleet, TransferingCargoFleet } from "../../../shared/model/v1/fleet";
import { waitForCargo } from "../../actions/fleet/wait-for-cargo";
import { giveOrTakeWorldMetal } from "../../actions/world/give-or-take-metal";
import { giveOrTakeWorldPopulation } from "../../actions/world/give-or-take-population";
import { transferCargoToWorld } from "../../actions/fleet/transfer-cargo-to-world";

export function cargoActions(
  fromWorldId: string,
  toWorldId: string,
  worlds: { [id: string]: World },
  metalPotential: { [worldId: string]: number },
  populationPotential: { [worldId: string]: number },
  fleet: ReadyFleet | TransferingCargoFleet,
  timestamp: number,
  warpToWorldDelay: number
) {
  const cargo = cargoAmounts(
    worlds[fromWorldId],
    toWorldId,
    metalPotential,
    populationPotential,
    fleet.ships
  )

  if (cargo.metal === 0 && cargo.population === 0) {
    const reverseCargo = cargoAmounts(
      worlds[toWorldId],
      fromWorldId,
      metalPotential,
      populationPotential,
      fleet.ships
    )

    if (reverseCargo.metal == 0 && reverseCargo.population == 0) {
      return [
        waitForCargo(fleet.id, toWorldId)
      ]
    }
  }

  const arrivingTimestamp = timestamp + warpToWorldDelay

  return [
    giveOrTakeWorldMetal(fromWorldId, -1 * cargo.metal),
    giveOrTakeWorldPopulation(fromWorldId, -1 * cargo.population),
    transferCargoToWorld(fleet.id, arrivingTimestamp, cargo.metal, cargo.population, toWorldId)
  ]
}

export function cargoPresent(
  worldFrom: World,
  worldTo: World,
  metalPotential: { [worldId: string]: number },
  populationPotential: { [worldId: string]: number }
) {
  const cargo = cargoAmounts(worldFrom, worldTo.id, metalPotential, populationPotential, Infinity)
  const reverseCargo = cargoAmounts(worldTo, worldFrom.id, metalPotential, populationPotential, Infinity)

  return cargo.population !== 0 || cargo.metal !== 0 || reverseCargo.population !== 0 || reverseCargo.metal !== 0
}

function cargoAmounts(
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