
import { expect } from 'chai';
import { runMap } from "../test-helper";
import { World, WorldWithOwner } from "../../../shared/model/v1/world";
import { testMap } from './population-test-map';

describe("population", () => {

  it("it grows in population", async () => {

    const state = await runMap(testMap)

    expect((state.universe.worlds["w1"] as WorldWithOwner).population["p1"]).to.equal(2)
  })

})



