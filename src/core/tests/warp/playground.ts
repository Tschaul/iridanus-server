import { warpTestMap } from "./warp-test-map";
import { Clock } from "../../clock";
import { Game } from "../../game";

const map = warpTestMap;

map.universe.fleets["f1"].orders.push({
  type: 'WARP',
  targetWorld: "w2"
})

map.universe.fleets["f1"].orders.push({
  type: 'WARP',
  targetWorld: "w3"
})

const game = new Game(new Clock(0), map);

game.gameEnded$.subscribe(console.log);



