import { scrappingTestMap } from "./scrapping-test-map";
import { Clock } from "../../infrastructure/clock";
import { Game } from "../../game";

import { expect } from 'chai';
import { ReadyFleet } from "../../../shared/model/v1/fleet";
import produce from "immer";
import { runMap } from "../test-helper";
import { World } from "../../../shared/model/v1/world";

describe("scrapping", () => {

  it("scrap ships", async () => {
    const map = produce(scrappingTestMap, draft => {

      draft.universe.fleets["f1"].orders.push({
        type: 'SCRAP_SHIPS_FOR_INDUSTRY',
        amount: 2
      })
  
    });

    const state = await runMap(map);

    expect((state.universe.fleets["f1"] as ReadyFleet).ships).to.equal(8)
    expect((state.universe.worlds["w1"] as World).industry).to.equal(2)
  })

  
})



