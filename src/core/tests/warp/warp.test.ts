import { warpTestMap } from "./warp-test-map";

import { expect } from 'chai';
import { ReadyFleet } from "../../../shared/model/v1/fleet";
import produce from "immer";
import { runMap } from "../test-helper";
import { WARPING_SYSTEM_KEY } from "../../events/warping/warping.system";
import { NO_SCORING_SYSTEM_KEY } from "../../events/scoring/scoring.system";

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
    
    const state = await runMap(map, [
      WARPING_SYSTEM_KEY,
      NO_SCORING_SYSTEM_KEY
    ]);

    expect((state.universe.fleets["f1"] as ReadyFleet).currentWorldId).to.equal("w3")
  })
})



