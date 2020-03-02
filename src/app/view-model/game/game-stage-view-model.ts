import { GameViewModel } from "./game-view-model";
import { observable, computed } from "mobx";
import { DrawingPositions } from "../../../shared/model/v1/drawing-positions";
import { World } from "../../../shared/model/v1/world";
import { fleetIsAtWorldAndHasOwner, fleetIsAtWorld, WarpingFleet } from "../../../shared/model/v1/fleet";
import { Vec2 } from "../../../shared/math/vec2";
import { GameData } from "./game-data";

export type GameStageMode = {
  type: 'NORMAL'
} | {
  type: 'SELECT_WORLD_TARGET',
  description: string,
  callback: (worldId: string) => void
}

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

  constructor(
    private gameViewModel: GameViewModel,
    private gameData: GameData,
    ) { }

  @computed get playerInfos() {
    return this.gameData.playerInfos;
  }

  @computed get doneLoading() {
    return this.gameData.doneLoading;
  }

  @observable public mode: GameStageMode = { type: 'NORMAL' };

  public requestWorldTargetSelection(description: string, callback: (worldId: string) => void) {
    this.mode = {
      type: 'SELECT_WORLD_TARGET',
      description,
      callback
    }
  }

  @observable public stageWidth = 0;
  @observable public stageHeight = 0;

  @computed get fleetOwnersByWorldId() {
    return Object.getOwnPropertyNames(this.gameData.fleetsByWorldId).reduce((result, key) => {
      const owners = this.gameData.fleetsByWorldId[key]
        .filter(fleetIsAtWorldAndHasOwner)
        .map(fleet => fleet.ownerId);
      result[key] = [...new Set(owners)];
      return result
    }, {} as { [k: string]: string[] })
  }

  @computed get selectedFleet() {
    return this.gameViewModel.selectedFleet;
  }

  @computed get selectedWorld() {
    return this.gameViewModel.selectedWorld;
  }

  @computed get drawingPositons() {
    const result: DrawingPositions = {}

    for (const key of Object.getOwnPropertyNames(this.gameData.rawDrawingPositions)) {
      const xMax = this.stageWidth - STAGE_OFFSET * 2;
      const yMax = this.stageHeight - STAGE_OFFSET * 2;
      const boxSize = Math.min(xMax, yMax);
      const xMin = STAGE_OFFSET + 0.5 * (xMax - boxSize);
      const yMin = STAGE_OFFSET + 0.5 * (yMax - boxSize);
      const rawPosition = this.gameData.rawDrawingPositions[key];
      result[key] = {
        x: xMin + boxSize * rawPosition.x,
        y: yMin + boxSize * rawPosition.y,
      }
    }

    return result;
  }

  @computed get worldsWithKeyAndDisplayPosition(): WorldWithKeyAndDisplayPosition[] {
    const worldKeys = Object.getOwnPropertyNames(this.gameData.worlds);
    return worldKeys.map(key => {
      return {
        ...this.gameData.worlds[key],
        ...this.drawingPositons[key],
        key
      }
    })
  }

  @computed get gatesWithDisplayPosition(): GateWithStartAndEndPosition[] {
    const gates = this.gameData.gates;
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
      if (!positionFrom || !positionTo) {
        console.log({ keyFrom, keyTo })
      }
      return {
        xStart: positionFrom.x,
        yStart: positionFrom.y,
        xEnd: positionTo.x,
        yEnd: positionTo.y
      }
    })
  }

  @computed get warpingFleetOwnersByBothWorlds(): Array<[string, Vec2, string, Vec2, string[]]> {

    const warpingFleetsMap = this.gameData.warpingFleetsByBothWorlds;

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
    if (this.mode.type === 'SELECT_WORLD_TARGET') {
      if (id) {
        this.mode.callback(id);
      }
      this.mode = { type: 'NORMAL' }
      return;
    }
    if (id) {
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