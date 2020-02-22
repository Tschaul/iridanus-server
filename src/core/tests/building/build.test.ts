import { buildTestMap } from "./build-test-map";

import { expect } from 'chai';
import produce from "immer";
import { runMap } from "../test-helper";
import { World } from "../../../shared/model/v1/world";

describe("build", () => {

  it("builds ships", async () => {
    const map = produce(buildTestMap, draft => {

      draft.universe.worlds["w1"].orders.push({
        type: 'BUILD_SHIPS',
        amount: 1
      })
  
    });
    expect((map.universe.worlds["w1"] as World).metal).to.equal(40)

    const state = await runMap(map, state => (state.universe.worlds["w1"] as World).metal);

    expect((state.universe.worlds["w1"] as World).ships).to.equal(6)
    expect((state.universe.worlds["w1"] as World).metal).to.equal(39)
  })
  
  it("builds industry", async () => {
    const map = produce(buildTestMap, draft => {

      draft.universe.worlds["w1"].orders.push({
        type: 'BUILD_INDUSTRY',
        amount: 1
      })
  
    });

    const state = await runMap(map);

    expect((state.universe.worlds["w1"] as World).industry).to.equal(6)
    expect((state.universe.worlds["w1"] as World).metal).to.equal(35)
  })

})



