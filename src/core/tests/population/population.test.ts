
import { expect } from 'chai';
import { runMap } from "../test-helper";
import { World, WorldWithOwner } from "../../../shared/model/v1/world";
import { testMap } from './population-test-map';
import { POPULATION_SYSTEM_KEY } from '../../events/population/population.system';
import { NO_SCORING_SYSTEM_KEY } from '../../events/scoring/scoring.system';

describe("population", () => {

  it("it grows in population", async () => {

    const state = await runMap(testMap, [
      POPULATION_SYSTEM_KEY,
      NO_SCORING_SYSTEM_KEY
    ])

    expect((state.universe.worlds["w1"] as WorldWithOwner).population["p1"]).to.equal(2)
  })

})



