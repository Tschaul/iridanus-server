import { map } from "./capture-test-map";
import produce from "immer";

import { runMap } from "../test-helper";
import { expect } from "chai";
import { ReadyFleet } from "../../model/fleet";
import { ReadyWorld } from "../../model/world";

describe("capture", () => {

  it("does capture fleet", async () => {
    
    const playedMap = produce(map, draft => {
      draft.universe.fleets["f2"].status = 'LOST';
    });

    const state = await runMap(playedMap);

    expect(state.universe.fleets["f2"].status).to.equal('READY');
    expect((state.universe.fleets["f2"] as ReadyFleet).ownerId).to.equal('p1');

  })

  it("does capture world", async () => {
    
    const playedMap = produce(map, draft => {
      draft.universe.fleets["f2"].status = 'LOST';
      draft.universe.worlds["w1"].status = 'LOST';
    });

    const state = await runMap(playedMap);

    expect(state.universe.worlds["w1"].status).to.equal('READY');
    expect((state.universe.worlds["w1"] as ReadyWorld).ownerId).to.equal('p1');

  })

  
})



