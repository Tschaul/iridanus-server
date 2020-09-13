// @ts-ignore
import * as solver from "javascript-lp-solver";
import { IModel } from "./solver";

const model: IModel = {
  optimize: "production",
  opType: "max",
  constraints: {
    active_industry_w1: { max: 10 },
    active_industry_w2: { max: 0 },
    active_industry_w3: { max: 0 },
    metal_w1: { min: 0 },
    metal_w2: { min: 0 },
    metal_w3: { min: -20 },
    ships: { max: 30 }
  },
  variables: {
    run_industry_w1: {
      active_industry_w1: 1,
      metal_w1: -1,
      production: 1
    },
    run_industry_w2: {
      active_industry_w2: 1,
      metal_w2: -1,
      production: 1
    },
    run_industry_w3: {
      active_industry_w3: 1,
      metal_w3: -1,
      production: 1
    },
    deploy_w1: {
      active_industry_w1: -1,
      ships: 5
    },
    deploy_w2: {
      active_industry_w2: -1,
      ships: 5
    },
    deploy_w3: {
      active_industry_w3: -1,
      ships: 5
    },
    cargo_w1_w2: {
      metal_w1: 1,
      metal_w2: -1,
      ships: 1
    },
    cargo_w2_w3: {
      metal_w2: 1,
      metal_w3: -1,
      ships: 1
    },
  },
  ints: {
    run_industry_w1: 1,
    deploy_w1: 1,
    cargo_w1_w2: 1,
    cargo_w2_w3: 1,
  }
}

const result = solver.Solve(model);
console.log(result);
