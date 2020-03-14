import { ReadyFleet, Fleet } from "../../../shared/model/v1/fleet";
import { ReadyWorld, World, WorldWithOwner } from "../../../shared/model/v1/world";
import { RandomNumberGenerator } from "../../infrastructure/random-number-generator";
import { GameRules } from "../../../shared/model/v1/rules";
import { Action } from "../../actions/action";
import { giveOrTakeFleetShips } from "../../actions/fleet/give-or-take-ships";
import { setFleetIntegrity } from "../../actions/fleet/set-integrity";
import { looseFleet } from "../../actions/fleet/loose-fleet";
import { setWorldIntegrity } from "../../actions/world/set-integrity";
import { giveOrTakeWorldShips } from "../../actions/world/give-or-take-ships";

export function handleFiring(attacker: ReadyFleet | WorldWithOwner, world: World, fleetsByCurrentworldId: any, config: GameRules, random: RandomNumberGenerator) {
  const targetResult = determineTarget(attacker, world, fleetsByCurrentworldId[world.id], random);
  if (!targetResult) {
    return []
  }
  const [targetType, target] = targetResult;
  const [newShips, newIntegrity] = determineDamage(attacker, target, targetType, config);
  const damageActions = makeActions(targetType, newShips, target, newIntegrity);
  return damageActions;
}

function determineTarget(attacker: ReadyFleet | WorldWithOwner, world: World, otherFleetsAtWorld: Fleet[], random: RandomNumberGenerator): ['WORLD', World] | ['FLEET', Fleet] | undefined {
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

}

function determineDamage(attacker: Fleet | World, defender: Fleet | World, targetType: 'WORLD' | 'FLEET', config: GameRules): [number, number] {

  const damageMultiplier = (targetType === 'FLEET' && defender.ships === defender.metal + defender.population) ? 2 : 1

  const damage = attacker.ships * config.combat.integrityDamagePerShip * damageMultiplier;

  let newShipsPlusIntegrity = defender.ships + defender.integrity - damage;

  if (newShipsPlusIntegrity < 0) {
    newShipsPlusIntegrity = 0;
  }

  return [Math.floor(newShipsPlusIntegrity), newShipsPlusIntegrity % 1]

}


function makeActions(targetType: string, newShips: number, target: Fleet | World, newIntegrity: number): Action[] {
  switch (targetType) {
    case 'FLEET':
      if (newShips <= 0) {
        return [
          giveOrTakeFleetShips(target.id, -1 * target.ships),
          setFleetIntegrity(target.id, 1),
          looseFleet(target.id),
        ];
      }
      else {
        return [
          giveOrTakeFleetShips(target.id, newShips - target.ships),
          setFleetIntegrity(target.id, newIntegrity),
        ];
      }
    case 'WORLD':
      if (newShips <= 0) {
        return [
          giveOrTakeWorldShips(target.id, -1 * target.ships),
          setWorldIntegrity(target.id, 1),
        ];
      }
      else {
        return [
          giveOrTakeWorldShips(target.id, newShips - target.ships),
          setWorldIntegrity(target.id, newIntegrity),
        ];
      }
    default:
      throw new Error('Could not make damage actions')

  }
}
