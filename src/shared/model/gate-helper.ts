import { Universe } from "./universe";

export function universeHasGate(universe: Universe, worldId1: string, worldId2: string): boolean {
  return universe.gates[worldId1].indexOf(worldId2) !== -1;
}