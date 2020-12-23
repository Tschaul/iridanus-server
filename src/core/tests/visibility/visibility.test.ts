import { visibilityTestMap } from "./visibility-test-map";

import { expect } from 'chai';
import produce from "immer";
import { runMap } from "../test-helper";
import { NOTIFY_SYSTEM_KEY } from "../../events/notification/notification.system";
import { NO_SCORING_SYSTEM_KEY } from "../../events/scoring/scoring.system";

describe("visibility", () => {

  it("worlds are discovered", async () => {

    const map = produce(visibilityTestMap, draft => {

    });

    const state = await runMap(map, [
      NOTIFY_SYSTEM_KEY,
      NO_SCORING_SYSTEM_KEY
    ]);

    expect((state.universe.worlds['w1']).worldHasBeenDiscovered).to.equal(true)
    expect((state.universe.worlds['w2']).worldHasBeenDiscovered).to.equal(true)
    expect((state.universe.worlds['w3']).worldHasBeenDiscovered).to.not.equal(true)
  })
})



