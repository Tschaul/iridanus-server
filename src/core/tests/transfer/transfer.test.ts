import { warpTestMap } from "./transfer-test-map";
import { Clock } from "../../infrastructure/clock";
import { Game } from "../../game";

import { expect } from 'chai';
import { ReadyFleet } from "../../../shared/model/v1/fleet";
import produce from "immer";
import { runMap } from "../test-helper";
import { World } from "../../../shared/model/v1/world";

describe("transfer", () => {

  it("load metal", async () => {
    const map = produce(warpTestMap, draft => {

      draft.universe.fleets["f1"].orders.push({
        type: 'TRANSFER_METAL',
        amount: 5
      })
  
    });

    const state = await runMap(map);

    expect((state.universe.fleets["f1"] as ReadyFleet).metal).to.equal(5)
    expect((state.universe.worlds["w1"] as World).metal).to.equal(5)
  })


  it("load metal (all of worlds metal with two fleets simultanously)", async () => {
    const map = produce(warpTestMap, draft => {

      draft.universe.fleets["f1"].orders.push({
        type: 'TRANSFER_METAL',
        amount: 10
      })
      draft.universe.fleets["f2"].orders.push({
        type: 'TRANSFER_METAL',
        amount: 10
      })
  
    });

    const state = await runMap(map);

    expect((state.universe.fleets["f1"] as ReadyFleet).metal).to.equal(10)
    expect((state.universe.fleets["f2"] as ReadyFleet).metal).to.equal(0)
    expect((state.universe.worlds["w1"] as World).metal).to.equal(0)
  })

  it("drop metal having none", async () => {
    const map = produce(warpTestMap, draft => {

      draft.universe.fleets["f1"].orders.push({
        type: 'TRANSFER_METAL',
        amount: -5
      })
  
    });

    const state = await runMap(map);

    expect((state.universe.fleets["f1"] as ReadyFleet).metal).to.equal(0)
    expect((state.universe.worlds["w1"] as World).metal).to.equal(10)
  })

  it("load ships", async () => {
    const map = produce(warpTestMap, draft => {

      draft.universe.fleets["f1"].orders.push({
        type: 'TRANSFER_SHIPS',
        amount: 5
      })
  
    });

    const state = await runMap(map);

    expect((state.universe.fleets["f1"] as ReadyFleet).ships).to.equal(15)
    expect((state.universe.worlds["w1"] as World).ships).to.equal(0)
  })

  it("drop ships", async () => {
    const map = produce(warpTestMap, draft => {

      draft.universe.fleets["f1"].orders.push({
        type: 'TRANSFER_SHIPS',
        amount: -5
      })
  
    });

    const state = await runMap(map);

    expect((state.universe.fleets["f1"] as ReadyFleet).ships).to.equal(5)
    expect((state.universe.worlds["w1"] as World).ships).to.equal(10)
  })

  it("drop ships and load ships", async () => {
    const map = produce(warpTestMap, draft => {

      draft.universe.fleets["f1"].orders.push({
        type: 'TRANSFER_SHIPS',
        amount: -99
      })
      draft.universe.fleets["f1"].orders.push({
        type: 'TRANSFER_SHIPS',
        amount: 99
      })
  
    });

    const state = await runMap(map);

    expect((state.universe.fleets["f1"] as ReadyFleet).ships).to.equal(15)
    expect((state.universe.worlds["w1"] as World).ships).to.equal(0)
  })
})



