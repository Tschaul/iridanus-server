import { scoringTestMap } from "./scoring-test-map";
import produce from "immer";
import { runMap } from "../test-helper";
import { expect } from "chai";

describe("scoring", () => {

  it("game end with correct timestamp", async () => {
    
    const playedMap = produce(scoringTestMap, draft => {
      draft.gameEndTimestamp = 100000
    });

    const state = await runMap(playedMap);

    expect(state.currentTimestamp).to.equal(state.gameEndTimestamp);

  })

  it("ends game with winner", async () => {
    
    const playedMap = produce(scoringTestMap, draft => {
      draft.universe.fleets["f1"].ships = 1;
    });

    const state = await runMap(playedMap);

    expect(state.currentTimestamp).not.to.equal(state.gameEndTimestamp);

    expect(state.scorings["p1"].score).to.be.greaterThan(state.scorings["p2"].score)

  })
  
})



