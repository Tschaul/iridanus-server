import { Game } from "./core/game";
import { Clock } from "./core/clock";
import { simpleMap } from "./core/maps/simple-map";

const clock = new Clock(new Date().getTime() - 3333);

const map = simpleMap;

simpleMap.universe.fleets["f1"].orders.push({
  type: 'WARP',
  targetWorld: "w2"
})

simpleMap.universe.fleets["f1"].orders.push({
  type: 'WARP',
  targetWorld: "w3"
})

simpleMap.currentTimestamp = clock.getTimestamp();

const game = new Game(clock, map);

// const store = new Store(simpleMap);

// store.state$.subscribe(console.log);

// store.dispatch(new IncreaseCounterAction())
// store.commit();


