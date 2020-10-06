import { World, WorldWithOwner } from "../../../shared/model/v1/world";

export function calculateActiveIndustry(world: WorldWithOwner) {
  return Math.min(world.population[world.ownerId], world.industry);
}