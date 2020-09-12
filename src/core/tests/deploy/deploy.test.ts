import { warpTestMap } from "./deploy-test-map";

import { expect } from 'chai';
import { ReadyFleet } from "../../../shared/model/v1/fleet";
import produce from "immer";
import { runMap } from "../test-helper";
import { ReadyWorld } from "../../../shared/model/v1/world";

describe("deploy ships to world", () => {

  it("deploys all its ships", async () => {
    
    const map = produce(warpTestMap, draft => {

      draft.universe.fleets["f1"].orders.push({
        type: 'DEPLOY_TO_WORLD',
      })
    });
    
    const state = await runMap(map);

    expect((state.universe.fleets["f1"] as ReadyFleet)).to.be.undefined;
    expect((state.universe.worlds["w1"] as ReadyWorld).industry).to.equal(20);
  })
})



