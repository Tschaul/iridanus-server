import { splitTestMap } from "./split-test-map";

import { expect } from 'chai';
import produce from "immer";
import { runMap } from "../test-helper";

describe("split fleet", () => {

  it("fleet splits", async () => {
    
    const map = produce(splitTestMap, draft => {

      draft.universe.fleets["f1"].orders.push({
        type: 'SPLIT_FLEET',
      })
    });
    
    const state = await runMap(map);

    const fleets = Object.values(state.universe.fleets)

    expect(fleets).to.have.lengthOf(2)
    expect(fleets[0].ships).to.equal(5)
    expect(fleets[1].ships).to.equal(5)
  })
})



