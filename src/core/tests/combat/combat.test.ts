import { map } from "./combat-test-map";

import { runMap } from "../test-helper";
import { expect } from "chai";

describe("combat", () => {

  it("does combat", async () => {
    
    const state = await runMap(map);

    expect(state.universe.fleets["f1"]).to.be.undefined
    expect(state.universe.worlds["w1"].status).to.equal("OWNED")
  })
  
})



