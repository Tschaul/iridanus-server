import { captureTestMap } from "./capture-test-map";
import produce from "immer";

import { runMap } from "../test-helper";
import { expect } from "chai";
import { ReadyFleet } from "../../../shared/model/v1/fleet";
import { ReadyWorld } from "../../../shared/model/v1/world";

describe("capture", () => {

  it("does capture fleet", async () => {
    
    const playedMap = produce(captureTestMap, draft => {
    });

    const state = await runMap(playedMap);

    expect(state.universe.fleets["f2"].status).to.equal('READY');
    expect((state.universe.fleets["f2"] as ReadyFleet).ownerId).to.equal('p1');

  })

  it("does capture world", async () => {
    
    const playedMap = produce(captureTestMap, draft => {
      draft.universe.worlds["w1"].status = 'LOST';
    });

    const state = await runMap(playedMap);

    expect(state.universe.worlds["w1"].status).to.equal('READY');
    expect((state.universe.worlds["w1"] as ReadyWorld).ownerId).to.equal('p1');

  })

  it("does not capture world on fly by", async () => {
    
    const playedMap = produce(captureTestMap, draft => {
      draft.universe.fleets["f1"].orders = [
        {
          type: 'WARP',
          targetWorldId: 'w2'
        },
        {
          type: 'WARP',
          targetWorldId: 'w3'
        }
      ]
    });

    const state = await runMap(playedMap);

    expect(state.universe.worlds["w2"].status).to.equal('LOST');

    expect(state.universe.worlds["w3"].status).to.equal('READY');
    expect((state.universe.worlds["w3"] as ReadyWorld).ownerId).to.equal('p1');

  })

  it("awaits capturing a world", async () => {
    
    const playedMap = produce(captureTestMap, draft => {
      draft.universe.fleets["f1"].orders = [
        {
          type: 'WARP',
          targetWorldId: 'w2'
        },
        {
          type: 'AWAIT_CAPTURE',
        },
        {
          type: 'WARP',
          targetWorldId: 'w3'
        }
      ]
    });

    const state = await runMap(playedMap);

    expect(state.universe.worlds["w2"].status).to.equal('READY');
    expect((state.universe.worlds["w2"] as ReadyWorld).ownerId).to.equal('p1');

    expect(state.universe.worlds["w3"].status).to.equal('READY');
    expect((state.universe.worlds["w3"] as ReadyWorld).ownerId).to.equal('p1');

  })

  
})



