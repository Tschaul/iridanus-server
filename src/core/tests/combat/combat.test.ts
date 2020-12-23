import { map } from "./combat-test-map";

import { runMap } from "../test-helper";
import { expect } from "chai";
import { COMBAT_SYSTEM_KEY } from "../../events/combat/combat.system";
import { NO_SCORING_SYSTEM_KEY } from "../../events/scoring/scoring.system";

describe("combat", () => {

  it("does combat", async () => {
    
    const state = await runMap(map, [
      COMBAT_SYSTEM_KEY,
      NO_SCORING_SYSTEM_KEY
    ]);

    expect(state.universe.fleets["f1"]).to.be.undefined
    expect(state.universe.worlds["w1"].status).to.equal("OWNED")
  })
  
})



