import { World } from "../../../shared/model/v1/world";

export function calculateActiveIndustry(world: World) {
  return Math.min(world.population, world.industry);
}