import { visibilityTestMap } from "./visibility-test-map";

import { expect } from 'chai';
import produce from "immer";
import { runMap } from "../test-helper";

describe.only("visibility", () => {

  it("worlds are discovered", async () => {

    const map = produce(visibilityTestMap, draft => {


    });

    const state = await runMap(map);

    expect((state.universe.worlds['w1']).worldDiscoveredNotificationSent).to.equal(true)
    expect((state.universe.worlds['w2']).worldDiscoveredNotificationSent).to.equal(true)
    expect((state.universe.worlds['w3']).worldDiscoveredNotificationSent).to.not.equal(true)
  })
})



