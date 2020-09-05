import { buildTestMap } from "./build-test-map";

import { expect } from 'chai';
import { runMap } from "../test-helper";
import { World } from "../../../shared/model/v1/world";

describe("build", () => {

  it("builds ships", async () => {

    const now = new Date().getTime();

    const state = await runMap(buildTestMap, { watcher: state => (state.currentTimestamp - now) });

    const fleets = Object.values(state.universe.fleets);

    expect(fleets).to.not.empty
    expect(fleets[0].ships).to.equal(5)

    expect((state.universe.worlds["w1"] as World).metal).to.equal(0)
  })


})



