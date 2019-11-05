import { warpTestMap } from "./warp-test-map";
import { Clock } from "../../infrastructure/clock";
import { Game } from "../../game";

import { expect } from 'chai';
import { ReadyFleet } from "../../model/fleet";
import produce from "immer";
import { runMap } from "../test-helper";

describe("warping", () => {

  it("warps two times in row", async () => {
    
    const map = produce(warpTestMap, draft => {

      draft.universe.fleets["f1"].orders.push({
        type: 'WARP',
        targetWorldId: "w2"
      })
  
      draft.universe.fleets["f1"].orders.push({
        type: 'WARP',
        targetWorldId: "w3"
      })
    });
    
    const state = await runMap(map);

    expect((state.universe.fleets["f1"] as ReadyFleet).currentWorldId).to.equal("w3")
  })
})



