import { Game } from "./core/game";
import { Clock } from "./core/clock";
import { simpleMap } from "./core/maps/simple-map";

const clock = new Clock(new Date().getTime() - 10000);

const map = simpleMap;

map.universe.fleets["f1"].orders.push({
  type: 'WARP',
  targetWorld: "w2"
})

map.universe.fleets["f1"].orders.push({
  type: 'TRANSFER_METAL',
  amount: -100,
})

map.universe.fleets["f1"].orders.push({
  type: 'WARP',
  targetWorld: "w3"
})

map.currentTimestamp = clock.getTimestamp();


const game = new Game(clock, map);

game.gameEnded$.subscribe(console.log);

// const store = new Store(simpleMap);

// store.state$.subscribe(console.log);

// store.dispatch(new IncreaseCounterAction())
// store.commit();


