import { warpTestMap } from "./deploy-test-map";

import { expect } from 'chai';
import { ReadyFleet } from "../../../shared/model/v1/fleet";
import produce from "immer";
import { runMap } from "../test-helper";
import { ReadyWorld, World, WorldWithOwner } from "../../../shared/model/v1/world";
import { DEPLOY_SYSTEM_KEY } from "../../events/deploy/deploy.system";
import { NO_SCORING_SYSTEM_KEY } from "../../events/scoring/scoring.system";

describe("deploy ships to world", () => {

  it("deploys all its ships", async () => {
    
    const map = produce(warpTestMap, draft => {

      draft.universe.fleets["f1"].orders.push({
        type: 'DEPLOY_TO_WORLD',
        worldId: 'w1'
      })
    });
    
    const state = await runMap(map, [
      DEPLOY_SYSTEM_KEY,
      NO_SCORING_SYSTEM_KEY
    ]);

    expect((state.universe.fleets["f1"] as ReadyFleet)).to.be.undefined;
    expect((state.universe.worlds["w1"] as World).industry).to.equal(20);
  })
})
