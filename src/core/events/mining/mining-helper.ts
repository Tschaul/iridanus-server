import { GameRules } from "../../../shared/model/v1/rules";
import { World, worldHasOwner } from "../../../shared/model/v1/world";

export function worldShouldBeMining(world: World, rules: GameRules) {
  return worldHasOwner(world)
    && world.mines > 0
    && world.metal < rules.mining.maximumMetal
    && !['@natives', '@defeated'].includes(world.ownerId)
}