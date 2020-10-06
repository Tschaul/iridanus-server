
import { expect } from 'chai';
import { runMap } from "../test-helper";
import { World } from "../../../shared/model/v1/world";
import { testMap } from './population-test-map';

describe("population", () => {

  it("it grows in population", async () => {

    const state = await runMap(testMap)

    console.log((state.universe.worlds["w1"] as World).population)

    expect((state.universe.worlds["w1"] as World).population["p1"]).to.equal(2)
  })

})



