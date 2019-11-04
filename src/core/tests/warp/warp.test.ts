import { warpTestMap } from "./warp-test-map";
import { Clock } from "../../clock";
import { Game } from "../../game";

import { expect } from 'chai';
import { ReadyFleet } from "../../model/fleet";

describe("wapring", async () => {

  const map = warpTestMap;

  map.universe.fleets["f1"].orders.push({
    type: 'WARP',
    targetWorld: "w2"
  })
  
  map.universe.fleets["f1"].orders.push({
    type: 'WARP',
    targetWorld: "w3"
  })

  const clock = new Clock(new Date().getTime() - 10000);

  map.currentTimestamp = clock.getTimestamp();
  
  const game = new Game(clock, map);
  
  const state = await game.startGameLoop();

  expect((state.universe.fleets["f1"] as ReadyFleet).currentWorldId).to.equal("w3")
})



