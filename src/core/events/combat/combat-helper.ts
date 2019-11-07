import { ReadyFleet, Fleet } from "../../model/fleet";
import { ReadyWorld, World } from "../../model/world";
import { RandomNumberGenerator } from "../../infrastructure/random-number-generator";
import { GameConfig } from "../../config";

export function determineTarget(attacker: ReadyFleet | ReadyWorld, world: World, otherFleetsAtWorld: Fleet[], random: RandomNumberGenerator): ['WORLD', World] | ['FLEET', Fleet] {
  const enemyFleets = otherFleetsAtWorld.filter(otherFleet =>
    otherFleet.status !== 'LOST'
    && otherFleet.ownerId !== attacker.ownerId);

  let worldTargetShips = world.ships;

  if (world.status === 'LOST' || world.ownerId === attacker.ownerId) {
    // don't fire at lost or your own world;
    worldTargetShips = 0;
  }

  const totalShips = worldTargetShips + enemyFleets.reduce((acc, fleet) => acc + fleet.ships, 0);

  let randomNumber = random.equal() * totalShips;

  if (randomNumber < worldTargetShips) {
    return ['WORLD', world]
  } else {
    randomNumber -= worldTargetShips

    for (const enemyFleet of enemyFleets) {
      if (randomNumber < enemyFleet.ships) {
        return ['FLEET', enemyFleet]
      } else {
        randomNumber -= enemyFleet.ships
      }
    }
  }

  throw new Error('Could not determine target.')
}

export function determineDamage(attacker: Fleet | World, defender: Fleet | World, config: GameConfig): [ number, number] {
  
  const damage = attacker.ships * config.combat.integrityDamagePerShip;

  let newShipsPlusIntegrity = defender.ships + defender.integrity - damage;

  if(newShipsPlusIntegrity < 0) {
    newShipsPlusIntegrity = 0;
  }

  return [Math.floor(newShipsPlusIntegrity), newShipsPlusIntegrity % 1]

}