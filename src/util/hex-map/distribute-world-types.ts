import { floydWarshall } from "../../shared/math/path-finding/floydWarshall";
import { Universe } from "../../shared/model/v1/universe";
import { WorldType } from "../../shared/model/v1/world-type";

export function distributeWorldTypes(universe: Universe) {

  const distances = floydWarshall(universe.gates);

  const lostWorldIds = Object.values(universe.worlds).filter(it => it.status === 'LOST').map(it => it.id);

  const potential = () => {
    return lostWorldIds.reduce((acc1, id1) => {
      return acc1 + lostWorldIds.reduce((acc2, id2) => {
        if (id1 === id2) {
          return acc2
        }
        const world1 = universe.worlds[id1];
        const world2 = universe.worlds[id2];
        const temp = (charge(world1.worldType.type) * charge(world2.worldType.type) / (distances[id1][id2] * distances[id1][id2]))
        if (isNaN(temp)) {
          console.log(charge(world1.worldType.type), charge(world2.worldType.type), distances[id1][id2], world1, world2)
          throw new Error("BOOM");

        }
        return acc2 + temp;
      }, 0)
    }, 0)
  }

  const maxCount = lostWorldIds.length * lostWorldIds.length

  let counter = 0;
  let currentPotential = potential();

  console.log({ counter, currentPotential })

  while (counter < maxCount) {
    counter++;

    const id1 = pick(lostWorldIds);
    const id2 = pick(lostWorldIds);

    switchWorlds(universe, id1, id2);
    const newPotential = potential();

    if (newPotential < currentPotential) {
      currentPotential = newPotential;
    } else {
      switchWorlds(universe, id2, id1);
    }

    // console.log({ counter, currentPotential })

  }
}

function switchWorlds(universe: Universe, id1: string, id2: string) {
  const tempWorldType = universe.worlds[id1].worldType;
  universe.worlds[id1].worldType = universe.worlds[id2].worldType;
  universe.worlds[id2].worldType = tempWorldType;
}

function pick(ids: string[]): string {
  const i = Math.floor(Math.random() * ids.length);
  return ids[i]
}

function charge(worldType: WorldType['type']): number {
  switch (worldType) {
    case 'CREEP': return -1;
    case 'DEFENSIVE': return 1;
    case 'DOUBLE': return 2;
    case 'INDUSTRIAL': return 1;
    case 'INSPIRING': return 1;
    case 'LUSH': return 1;
    case 'MINING': return 1;
    case 'NEBULA': return -1.5;
    case 'POPULATED': return 1;
    case 'VOID': return -1;
    default: return 0;
  }
}