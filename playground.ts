import { Game } from "./src/core/game";
import { Clock } from "./src/core/clock";
import { simpleMap } from "./src/core/maps/simple-map";

const clock = new Clock(new Date().getTime() - 3333);

const map = simpleMap;

simpleMap.universe.fleets["f1"].orders.push({
  type: 'WARP',
  targetWorld: "w2"
})

simpleMap.currentTimestamp = clock.getTimestamp();

const game = new Game(clock, map);
