import { ReadyFleet, Fleet } from "../../../shared/model/v1/fleet";
import { World, worldhasOwner } from "../../../shared/model/v1/world";
import { RandomNumberGenerator } from "../../infrastructure/random-number-generator";
import { GameRules } from "../../../shared/model/v1/rules";
import { Action } from "../../actions/action";
import { giveOrTakeFleetShips } from "../../actions/fleet/give-or-take-ships";
import { setFleetIntegrity } from "../../actions/fleet/set-integrity";
import { looseFleet } from "../../actions/fleet/loose-fleet";
import { giveOrTakeWorldIndustry } from "../../actions/world/give-or-take-industry";
import { giveOrTakeWorldPopulation } from "../../actions/world/give-or-take-population";

export function handleFiring(attacker: ReadyFleet, world: World, fleetsByCurrentworldId: any, config: GameRules, random: RandomNumberGenerator) {
  const target = determineTarget(attacker, world, fleetsByCurrentworldId[world.id], random);

  if (!target) {
    return []
  }

  const [newShips, newIntegrity] = determineDamage(attacker, target, config);
  const damageActions = makeActions(newShips, target, newIntegrity);

  const [industryDamage, populationDamage] = determineCollateralDamage(attacker, world, config, random);
  const collateralActions = makeCollateralActions(industryDamage, populationDamage, world);

  return [...damageActions, ...collateralActions];
}



function determineTarget(attacker: ReadyFleet, world: World, otherFleetsAtWorld: Fleet[], random: RandomNumberGenerator): Fleet | undefined {
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

function determineCollateralDamage(attacker: ReadyFleet, world: World, config: GameRules, random: RandomNumberGenerator): [number, number] {
  if (worldhasOwner(world) && attacker.ownerId === world.ownerId) {
    return [0, 0]
  }

  let industryDamage = 0;
  let populationDamage = 0;

  for (let i = 0; i < attacker.ships; i++) {
    if (random.equal() < config.combat.industryDamageChancePerShip) {
      industryDamage++;
    }
    if (random.equal() < config.combat.populationDamageChancePerShip) {
      populationDamage++;
    }
  }

  return [industryDamage, populationDamage]
}

function determineDamage(attacker: Fleet, defender: Fleet, config: GameRules): [number, number] {

  const damage = attacker.ships * config.combat.integrityDamagePerShip;

  let newShipsPlusIntegrity = defender.ships + defender.integrity - damage;

  if (newShipsPlusIntegrity < 0) {
    newShipsPlusIntegrity = 0;
  }

  return [Math.floor(newShipsPlusIntegrity), newShipsPlusIntegrity % 1]

}

function makeCollateralActions(industryDamage: number, populationDamage: number, world: World): Action[] {
  return [
    ...(industryDamage > 0 ? [giveOrTakeWorldIndustry(world.id, -1 * industryDamage)] : []),
    ...(populationDamage > 0 ? [giveOrTakeWorldPopulation(world.id, -1 * populationDamage)] : []),
  ]
}

function makeActions(newShips: number, target: Fleet, newIntegrity: number): Action[] {
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
}
