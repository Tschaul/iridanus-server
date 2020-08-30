import { cargoTestMap } from "./cargo-test-map";

import { expect } from 'chai';
import produce from "immer";
import { runMap } from "../test-helper";
import { ReadyWorld } from "../../../shared/model/v1/world";

describe("cargo", () => {

  it("transports population and metal", async () => {
    
    const map = produce(cargoTestMap, draft => {

      draft.universe.fleets["f1"].orders.push({
        type: 'START_CARGO_MISSION',
        otherWorldId: "w2"
      })
    });
    
    const state = await runMap(map);

    expect((state.universe.worlds["w1"] as ReadyWorld).metal)
      .to.be.greaterThan(cargoTestMap.universe.worlds["w1"].metal)
  })
})



