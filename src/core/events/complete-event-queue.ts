import { injectable } from "inversify";
import { GameEventQueue, GameEvent, combineEventQueues } from "./event";
import { Observable } from "rxjs";
import { ArriveAtWorldEventQueue } from "./warping/arrive-world";
import { BeginWarpEventQueue } from "./warping/begin-warp";
import { EndWarpEventQueue } from "./warping/end-warp";
import { LeaveWorldEventQueue } from "./warping/leave-world";
import { WorldStartMiningEventQueue } from "./mining/world-start-mining";
import { WorldMinesMetalEventQueue } from "./mining/world-mines-metal";
import { WorldStopMiningEventQueue } from "./mining/world-stop-mining";
import { DiscoverWorldEventQueue } from "./notification/notify-world-discovered";
import { WorldStartGrowingEventQueue } from "./population/world-start-growing";
import { WorldPopulationGrowsEventQueue } from "./population/world-population-grows";
import { WorldStopGrowingEventQueue } from "./population/world-stop-growing";
import { GameEndsEventQueue } from "./scoring/game-ends";
import { NotifyFleetIdleEventQueue } from "./notification/notify-fleet-idle";
import { FleetSplitsEventQueue } from "./fleet-grouping/fleet-splits";
import { FleetDeploysToWorldEventQueue } from "./deploy/fleet-deploys-to-world";
import { PlayerGetsDefeatedEventQueue } from "./surrender/player-gets-defeated";
import { PlayerSurrendersEventQueue } from "./surrender/player-surrenders";
import { BuildingSystem } from "./building/building.system";
import { CaptureSystem } from "./capture/capture.system";
import { CargoSystem } from "./cargo/cargo.system";
import { CombatSystem } from "./combat/combat.system";
import { MiningSystem } from "./mining/mining.system";
import { NotifySystem } from "./notification/notification.system";
import { PopulationSystem } from "./population/population.system";
import { ScoringSystem } from "./scoring/scoring.system";
import { FleetGroupingSystem } from "./fleet-grouping/fleet-grouping.system";
import { SurrenderSystem } from "./surrender/surrender.system";
import { WarpingSystem } from "./warping/warping.system";
import { DeploySystem } from "./deploy/deploy.system";
import { GameSetupProvider } from "../game-setup-provider";

@injectable()
export class CompleteEventQueue implements GameEventQueue {

  upcomingEvent$: Observable<GameEvent | null>;

  constructor(
    setup: GameSetupProvider,
    scoringSystem: ScoringSystem,
    surrenderSystem: SurrenderSystem,
    warpingSystem: WarpingSystem,
    buildingSystem: BuildingSystem,
    combatSystem: CombatSystem,
    miningSystem: MiningSystem,
    populationSystem: PopulationSystem,
    captureSystem: CaptureSystem,
    cargoSystem: CargoSystem,
    notifySystem: NotifySystem,
    fleetGroupingSystem: FleetGroupingSystem,
    deploySystem: DeploySystem
  ) {

    const allEventQueues = [
      surrenderSystem,
      captureSystem,
      scoringSystem,
      warpingSystem,
      buildingSystem,
      combatSystem,
      miningSystem,
      populationSystem,
      cargoSystem,
      notifySystem,
      fleetGroupingSystem,
      deploySystem
    ].filter(it => setup.activeSystems.includes(it.key)).map(it => it.queue)

    this.upcomingEvent$ = combineEventQueues(allEventQueues)

  }
}