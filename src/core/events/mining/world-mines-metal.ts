// import { GameEvent, GameEventQueue } from "../event";
// import { Observable } from "rxjs";
// import { map, withLatestFrom } from "rxjs/operators";
// import { injectable } from "inversify";
// import { CombatAndCaptureProjector } from "../../projectors/combat-and-capture-projector";
// import { TimeProjector } from "../../projectors/time-projector";
// import { captureWorld } from "../../actions/world/capture";
// import { WorldProjector } from "../../projectors/world-projector";

// @injectable()
// export class CaptureWorldEventQueue implements GameEventQueue {

//   public upcomingEvent$: Observable<GameEvent | null>;

//   constructor(
//     public worlds: WorldProjector,
//     public time: TimeProjector,
//   ) {
//     this.upcomingEvent$ = this.worlds.byId$.pipe(
//       map((worlds) => {



//         if (!world) {
//           return null
//         } else {
//           return {
//             timestamp,
//             happen: () => {
//               return [
//                 captureWorld(world.id, newOwnerId),
//               ];
//             }
//           }
//         }
//       })
//     )
//   }
// }
