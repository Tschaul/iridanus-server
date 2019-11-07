import { Container } from "inversify";
import { FleetProjector } from "./fleet-projector";
import { WorldProjector } from "./world-projector";
import { TimeProjector } from "./time-projector";
import { CombatProjector } from "./combat-projector";

export function registerProjectors(container: Container) {
  container.bind(FleetProjector).toSelf();
  container.bind(WorldProjector).toSelf();
  container.bind(TimeProjector).toSelf();
  container.bind(CombatProjector).toSelf();
}