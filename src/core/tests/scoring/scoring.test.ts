import { scoringTestMap } from "./scoring-test-map";
import produce from "immer";
import { runMap } from "../test-helper";
import { expect } from "chai";
import { WorldWithOwner } from "../../../shared/model/v1/world";

describe("scoring", () => {

  it("game end with correct timestamp", async () => {
    
    const playedMap = produce(scoringTestMap, draft => {
      draft.gameEndTimestamp = 10000
    });

    const state = await runMap(playedMap);

    expect(state.currentTimestamp).to.equal(state.gameEndTimestamp);

  })

  it("ends game with winner", async () => {
    
    const playedMap = produce(scoringTestMap, draft => {
      (draft.universe.worlds["w1"] as WorldWithOwner).population['p1'] = 100;
    });

    const state = await runMap(playedMap);

    expect(state.currentTimestamp).not.to.equal(state.gameEndTimestamp);

    expect(state.players["p1"].status).to.equal('VICTORIOUS')
    expect(state.players["p2"].status).to.equal('DEFEATED')

  })
  
})



