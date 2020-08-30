import { cargoTestMap } from "./cargo-test-map";
import { Clock } from "../../infrastructure/clock";
import { Game } from "../../game";

import { expect } from 'chai';
import { ReadyFleet } from "../../../shared/model/v1/fleet";
import produce from "immer";
import { runMap } from "../test-helper";
import { ReadyWorld } from "../../../shared/model/v1/world";

describe.only("cargo", () => {

  it("transports population and metal", async () => {
    
    const map = produce(cargoTestMap, draft => {

      draft.universe.fleets["f1"].orders.push({
        type: 'START_CARGO_MISSION',
        otherWorldId: "w2"
      })
    });
    
    const state = await runMap(map);

    console.log(state.universe.worlds["w1"], state.universe.worlds["w2"])
    expect((state.universe.worlds["w1"] as ReadyWorld).metal)
      .to.be.greaterThan(cargoTestMap.universe.worlds["w1"].metal)
  })
})



