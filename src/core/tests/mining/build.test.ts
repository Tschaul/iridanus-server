import { miningTestMap } from "./mining-test-map";

import { expect } from 'chai';
import produce from "immer";
import { runMap } from "../test-helper";
import { World } from "../../../shared/model/v1/world";
import { testRules } from "../test-config";

describe("mining", () => {

  it("it mines metal", async () => {
    const rules = produce(testRules, draft => {
      draft.mining.maximumMetal = 5;
    });

    const state = await runMap(miningTestMap, {rules})

    expect((state.universe.worlds["w1"] as World).metal).to.equal(5)
  })

})



