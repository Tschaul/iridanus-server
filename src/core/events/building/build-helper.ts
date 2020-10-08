import { BuildingShipsWorld, World, WorldWithOwner } from "../../../shared/model/v1/world";

export function calculateActiveIndustry(world: WorldWithOwner) {
  return Math.min(world.population[world.ownerId], world.industry);
}

export function calculateBuildDelay(world: WorldWithOwner, amount: number, baseDelay: number) {
  let delay = baseDelay * amount / calculateActiveIndustry(world);
  if (world.worldType.type === 'INDUSTRIAL') {
    delay /= 1.5
  }
  return delay;
}

export function calculateOldBuildDelay(world: WorldWithOwner & {buildShipsStatus: BuildingShipsWorld}, baseDelay: number) {
  let delay = baseDelay * world.buildShipsStatus.amount / world.buildShipsStatus.activeIndustry;
  if (world.worldType.type === 'INDUSTRIAL') {
    delay /= 1.5
  }
  return delay;
}