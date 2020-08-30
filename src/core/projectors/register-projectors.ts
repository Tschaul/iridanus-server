import { Container } from "inversify";
import { FleetProjector } from "./fleet-projector";
import { WorldProjector } from "./world-projector";
import { TimeProjector } from "./time-projector";
import { CombatAndCaptureProjector } from "./combat-and-capture-projector";
import { GatesProjector } from "./gates-projector";
import { VisibilityProjector } from "./visibility-projector";
import { InfluenceProjector } from "./influence-projector";
import { CargoProjector } from "./cargo-projector";
import { PlayerProjector } from "./player-projector";

export function registerProjectors(container: Container) {
  container.bind(FleetProjector).toSelf();
  container.bind(WorldProjector).toSelf();
  container.bind(TimeProjector).toSelf();
  container.bind(CombatAndCaptureProjector).toSelf();
  container.bind(GatesProjector).toSelf();
  container.bind(VisibilityProjector).toSelf();
  container.bind(InfluenceProjector).toSelf();
  container.bind(CargoProjector).toSelf();
  container.bind(PlayerProjector).toSelf();
}