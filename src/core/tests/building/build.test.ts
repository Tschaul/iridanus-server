import { buildTestMap } from "./build-test-map";

import { expect } from 'chai';
import { runMap } from "../test-helper";
import { World } from "../../../shared/model/v1/world";
import { BUILDING_SYSTEM_KEY } from "../../events/building/building.system";
import { NO_SCORING_SYSTEM_KEY } from "../../events/scoring/scoring.system";

describe("build", () => {

  it("builds ships", async () => {

    const now = new Date().getTime();

    const state = await runMap(buildTestMap, [
      BUILDING_SYSTEM_KEY,
      NO_SCORING_SYSTEM_KEY
    ], { watcher: state => (state.currentTimestamp - now) });

    const fleets = Object.values(state.universe.fleets);

    expect(fleets).to.not.empty
    expect(fleets[0].ships).to.equal(5)

    expect((state.universe.worlds["w1"] as World).metal).to.equal(0)
  })


})



