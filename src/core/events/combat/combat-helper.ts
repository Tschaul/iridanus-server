import { ReadyFleet, Fleet } from "../../../shared/model/v1/fleet";
import { World } from "../../../shared/model/v1/world";
import { RandomNumberGenerator } from "../../infrastructure/random-number-generator";
import { GameRules } from "../../../shared/model/v1/rules";
import { giveOrTakeFleetShips } from "../../actions/fleet/give-or-take-ships";
import { giveOrTakeWorldPopulation } from "../../actions/world/give-or-take-population";

export function handleFiring(attacker: ReadyFleet, world: World, fleetsByCurrentworldId: any, config: GameRules, random: RandomNumberGenerator) {
  const target = determineTargetFleet(attacker, fleetsByCurrentworldId[world.id], random);

  if (!target) {

    const worldDamage = determineWorldDamage(attacker, config);

    let killedPopulation = Math.floor(worldDamage);

    if (random.equal() < (worldDamage % 1)) {
      killedPopulation++;
    }

    return [
      giveOrTakeWorldPopulation(world.id, -1 * killedPopulation)
    ]

  }

  const [fleetDamage, integrityDamage] = determineFleetDamage(attacker, config);

  return [
    giveOrTakeFleetShips(target.id, -1 * fleetDamage, -1 * integrityDamage)
  ]

}

function determineWorldDamage(attacker: ReadyFleet, config: GameRules) {
  return attacker.ships * config.combat.populationDamagePerShip;
}

function determineTargetFleet(attacker: ReadyFleet, otherFleetsAtWorld: Fleet[], random: RandomNumberGenerator): Fleet | undefined {
  const enemyFleets = otherFleetsAtWorld.filter(otherFleet => otherFleet.ownerId !== attacker.ownerId);

  const totalShips = enemyFleets.reduce((acc, fleet) => acc + fleet.ships, 0);

  let randomNumber = random.equal() * totalShips;

  for (const enemyFleet of enemyFleets) {
    if (randomNumber < enemyFleet.ships) {
      return enemyFleet
    } else {
      randomNumber -= enemyFleet.ships
    }
  }

}

function determineFleetDamage(attacker: Fleet, config: GameRules): [number, number] {

  const rawDamage = attacker.ships * config.combat.integrityDamagePerShip;

  return [Math.floor(rawDamage), rawDamage % 1];

  // let newShipsPlusIntegrity = defender.ships + defender.integrity - damage;

  // if (newShipsPlusIntegrity < 0) {
  //   newShipsPlusIntegrity = 0;
  // }

  // return [Math.floor(newShipsPlusIntegrity), newShipsPlusIntegrity % 1]

}

// function makeFleetDamageActions(newShips: number, target: Fleet, newIntegrity: number): Action[] {
//   if (newShips <= 0) {
//     return [
//       giveOrTakeFleetShips(target.id, -1 * target.ships),
//     ];
//   }
//   else {
//     return [
//       giveOrTakeFleetShips(target.id, newShips - target.ships),
//       setFleetIntegrity(target.id, newIntegrity),
//     ];
//   }
// }
