import { makeId } from "../../app/client/make-id";
import { Fleet } from "../../shared/model/v1/fleet";
import { Universe } from "../../shared/model/v1/universe";
import { baseWorld, LostWorld } from "../../shared/model/v1/world";

export function applyWorldType(universe: Universe) {

  for (const worldId of Object.getOwnPropertyNames(universe.worlds)) {
    const world = universe.worlds[worldId];
    if (world.status === 'LOST') {
      switch (world.worldType.type) {
        case 'NEBULA':
        case 'VOID':
          world.populationLimit = 10;
          world.metal = 0;
          world.industry = 0;
          break;
        case 'DOUBLE':
          world.populationLimit *= 2;
          world.metal *= 2;
          world.industry = 0;
          break;
        case 'MINING':
          world.mines = 5;
          break;
        case 'POPULATED':
          universe.worlds[worldId] = {
            ...baseWorld(world),
            industry: 0,
            status: 'OWNED',
            combatStatus: { type: 'AT_PEACE' },
            ownerId: '@natives',
            miningStatus: { type: 'NOT_MINING' },
            populationGrowthStatus: { type: 'NOT_GROWING' },
            populationConversionStatus: { type: 'NOT_BEING_CAPTURED' },
            buildShipsStatus: { type: 'NOT_BUILDING_SHIPS' },
            population: { '@natives': Math.round(world.populationLimit / 4) }
          }
          break;
        case 'CREEP':
          const pirateFleetId = makeId();
          const pirateFleet: Fleet = {
            status: 'READY',
            combatStatus: 'AT_PEACE',
            currentWorldId: worldId,
            id: pirateFleetId,
            integrity: 1,
            orders: [],
            ownerId: '@creep',
            ships: 5,
            idleNotificationSent: true
          }
          universe.fleets[pirateFleetId] = pirateFleet;
          break;
        default: break;
      }
    }
  }

}