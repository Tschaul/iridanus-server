import { GameViewModel } from "./game-view-model";
import { observable, computed } from "mobx";
import { DrawingPositions } from "../../../shared/model/drawing-positions";
import { World } from "../../../shared/model/world";
import { fleetIsAtWorldAndHasOwner } from "../../../shared/model/fleet";

const STAGE_OFFSET = 75;

export type WorldWithKeyAndDisplayPosition = World & {
  key: string,
  x: number,
  y: number
}

export type GateWithStartAndEndPosition = {
  xStart: number,
  yStart: number,
  xEnd: number,
  yEnd: number
}

export class GameStageViewModel {
  constructor(private gameViewModel: GameViewModel) { }

  get playerInfos() {
    return this.gameViewModel.playerInfos;
  }

  @observable public stageWidth = 0;
  @observable public stageHeight = 0;

  @computed get fleetOwnersByWorldId() {
    return Object.getOwnPropertyNames(this.gameViewModel.fleetsByWorldId).reduce((result, key) => {
      const owners = this.gameViewModel.fleetsByWorldId[key]
        .filter(fleetIsAtWorldAndHasOwner)
        .map(fleet => fleet.ownerId);
      result[key] = [...new Set(owners)];
      return result
    }, {} as { [k: string]: string[] })
  }

  @computed get drawingPositons() {
    const result: DrawingPositions = {}

    for (const key of Object.getOwnPropertyNames(this.gameViewModel.rawDrawingPositions)) {
      const xMax = this.stageWidth - STAGE_OFFSET * 2;
      const yMax = this.stageHeight - STAGE_OFFSET * 2;
      const xMin = STAGE_OFFSET;
      const yMin = STAGE_OFFSET;
      const rawPosition = this.gameViewModel.rawDrawingPositions[key];
      result[key] = {
        x: xMin + xMax * rawPosition.x,
        y: yMin + yMax * rawPosition.y,
      }
    }

    return result;
  }

  @computed get worldsWithKeyAndDisplayPosition(): WorldWithKeyAndDisplayPosition[] {
    const worldKeys = Object.getOwnPropertyNames(this.gameViewModel.universe.worlds);
    return worldKeys.map(key => {
      return {
        ...this.gameViewModel.universe.worlds[key],
        ...this.drawingPositons[key],
        key
      }
    })
  }

  @computed get gatesWithDisplayPosition(): GateWithStartAndEndPosition[] {
    const gates = this.gameViewModel.universe.gates;
    const gatesSet = new Set<[string, string]>();
    const worldKeys = Object.getOwnPropertyNames(gates);
    for (const key of worldKeys) {
      for (const key2 of gates[key]) {
        if (key.localeCompare(key2) > 0) {
          gatesSet.add([key, key2])
        }
      }
    }
    return Array.from(gatesSet).map(([keyFrom, keyTo]) => {
      const positionFrom = this.drawingPositons[keyFrom];
      const positionTo = this.drawingPositons[keyTo];
      return {
        xStart: positionFrom.x,
        yStart: positionFrom.y,
        xEnd: positionTo.x,
        yEnd: positionTo.y
      }
    })
  }
}