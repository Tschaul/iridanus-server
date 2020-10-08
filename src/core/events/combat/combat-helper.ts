import { ReadyFleet, Fleet } from "../../../shared/model/v1/fleet";
import { World } from "../../../shared/model/v1/world";
import { RandomNumberGenerator } from "../../infrastructure/random-number-generator";
import { GameRules } from "../../../shared/model/v1/rules";
import { giveOrTakeFleetShips } from "../../actions/fleet/give-or-take-ships";

export function handleFiring(attacker: ReadyFleet, world: World, fleetsByCurrentworldId: any, config: GameRules, random: RandomNumberGenerator) {
  const target = determineTargetFleet(attacker, fleetsByCurrentworldId[world.id], random);

  if (!target) {
    return []
  }


  const [fleetDamage, integrityDamage] = determineFleetDamage(attacker, target, world, config);

  return [
    giveOrTakeFleetShips(target.id, -1 * fleetDamage, -1 * integrityDamage)
  ]

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

function determineFleetDamage(attacker: Fleet, target: Fleet, world: World, config: GameRules,): [number, number] {

  let rawDamage = attacker.ships * config.combat.integrityDamagePerShip;

  if (world.worldType.type === 'DEFENSIVE' && world.status === 'OWNED' && world.ownerId === target.ownerId) {
    rawDamage /= 1.5
  }

  return [Math.floor(rawDamage), rawDamage % 1];

}
