import { visibilityTestMap } from "./visibility-test-map";

import { expect } from 'chai';
import { ReadyFleet } from "../../../shared/model/v1/fleet";
import produce from "immer";
import { runMap } from "../test-helper";

describe("visibility", () => {

  it("warps back and forth remebers world", async () => {
    
    const map = produce(visibilityTestMap, draft => {

      draft.universe.fleets["f1"].orders.push({
        type: 'WARP',
        targetWorldId: "w2"
      })
  
      draft.universe.fleets["f1"].orders.push({
        type: 'AWAIT_CAPTURE',
      })
  
      draft.universe.fleets["f1"].orders.push({
        type: 'WARP',
        targetWorldId: "w1"
      })

    });
    
    const state = await runMap(map);

    console.log(state.universe.visibility['p1'])

    expect((state.universe.visibility['p1']['w1']).status).to.equal("VISIBLE")
    expect((state.universe.visibility['p1']['w2']).status).to.equal("VISIBLE")
    expect((state.universe.visibility['p1']['w3']).status).to.equal("REMEBERED")
  })
})



