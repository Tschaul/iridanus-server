import { GameViewModel } from "./game-view-model";
import { observable, computed } from "mobx";
import { DrawingPositions } from "../../../shared/model/drawing-positions";
import { World } from "../../../shared/model/world";
import { fleetIsAtWorldAndHasOwner, fleetIsAtWorld, WarpingFleet } from "../../../shared/model/fleet";
import { Vec2 } from "../../../shared/math/vec2";

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

  @computed get warpingFleetOwnersByBothWorlds(): Array<[string, Vec2, string, Vec2, string[]]> {
    
    const warpingFleetsMap = this.gameViewModel.warpingFleetsByBothWorlds;

    const result = [] as Array<[string, Vec2, string, Vec2, string[]]>;

    for (const key1 of Object.getOwnPropertyNames(warpingFleetsMap)) {
      for (const key2 of Object.getOwnPropertyNames(warpingFleetsMap[key1])) {
        const world1Vec = this.drawingPositons[key1];
        const world2Vec = this.drawingPositons[key2];
        const fleets = warpingFleetsMap[key1][key2];
        const fleetOwners = [...new Set(fleets.map(fleet => fleet.ownerId))];
        result.push([key1, world1Vec, key2, world2Vec, fleetOwners]);
      }
    }
    return result;

  }

  public selectWorld(id: string | null) {
    if(id) {
      this.gameViewModel.stageSelection = {
        type: 'WORLD',
        id
      }
    } else {
      this.gameViewModel.stageSelection = {
        type: 'NONE',
      }
    }
    this.gameViewModel.selectedFleetdId = null;
  }

  public selectGate(id1: string, id2: string) {
    this.gameViewModel.stageSelection = {
      type: 'GATE',
      id1,
      id2
    }
    this.gameViewModel.selectedFleetdId = null;
  }
}