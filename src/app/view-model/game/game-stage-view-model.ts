import { observable, computed } from "mobx";
import { DrawingPositions } from "../../../shared/model/v1/drawing-positions";
import { FleetInTransit } from "../../../shared/model/v1/fleet";
import { Vec2 } from "../../../shared/math/vec2";
import { GameData } from "./game-data";
import { GameStageSelection } from "./stage-selection";
import { WorldHints } from "./world-hints";
import { VisibleWorld } from "../../../shared/model/v1/visible-state";
import { GameNotifications } from "./game-notifications";
import { GameClock } from "./clock";
import { OrderEditorViewModel } from "./order-editor-view-model";
import { PlayersViewModel } from "./player-infos-view-model";
import { ServerEnvironment } from "../server-environment";
import { EnvironmentInfo } from "../../../shared/messages/subscriptions/environment-subscription-results";
import { GameViewModel } from "./game-view-model";


const STAGE_OFFSET = 75;

export type WorldToDisplay = VisibleWorld & {
  key: string,
  x: number,
  y: number,
  hasUnreadNotifications: boolean
}

export type GateWithStartAndEndPosition = {
  xFrom: number,
  yFrom: number,
  worldFromId: string,
  xTo: number,
  yTo: number,
  worldToId: string,
}

export type FleetInTransitWithProgress = FleetInTransit & {
  transitPosition: number
}

export class GameStageViewModel {
  @computed get mode() {
    return this.selection.mode;
  }

  constructor(
    private gameViewModel: GameViewModel,
    private gameData: GameData,
    private selection: GameStageSelection,
    private worldHints: WorldHints,
    private gameNotifcations: GameNotifications,
    private orderEditor: OrderEditorViewModel,
    private clock: GameClock,
    private playersViewModel: PlayersViewModel,
    private environment: ServerEnvironment
  ) { }

  @computed get selfPlayerId() {
    return this.gameViewModel.selfPlayerId
  }

  @computed get players() {
    return this.playersViewModel;
  }

  @computed get doneLoading() {
    return this.gameData.doneLoading;
  }

  @observable public stageWidth = 0;
  @observable public stageHeight = 0;

  @computed get fleetsByWorldId() {
    return this.gameData.fleetsByWorldId
  }

  @computed get selectedFleet() {
    return this.selection.selectedFleet;
  }

  @computed get selectedWorld() {
    return this.selection.selectedWorld;
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

  @computed get worldsToDisplay(): WorldToDisplay[] {
    const worldKeys = Object.getOwnPropertyNames(this.gameData.worlds);
    return worldKeys.map(key => {
      const notifications = this.gameNotifcations.notificationsByWorldId[key] || [];
      const hasUnreadNotifications = notifications.some(it => !it.markedAsRead);
      return {
        ...this.gameData.worlds[key],
        ...this.drawingPositons[key],
        key,
        hasUnreadNotifications
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
        throw new Error('no display potision for ' + JSON.stringify([keyFrom, keyTo]))
      }
      return {
        xFrom: positionFrom.x,
        yFrom: positionFrom.y,
        xTo: positionTo.x,
        yTo: positionTo.y,
        worldToId: keyTo,
        worldFromId: keyFrom
      }
    })
  }

  @computed get warpingFleetsByBothWorlds(): Array<[string, Vec2, string, Vec2, FleetInTransitWithProgress[]]> {

    const warpingFleetsMap = this.gameData.fleetsInTransitByBothWorlds;

    const result = [] as Array<[string, Vec2, string, Vec2, FleetInTransitWithProgress[]]>;

    for (const key1 of Object.getOwnPropertyNames(warpingFleetsMap)) {
      for (const key2 of Object.getOwnPropertyNames(warpingFleetsMap[key1])) {
        const world1Vec = this.drawingPositons[key1];
        const world2Vec = this.drawingPositons[key2];
        const fleets = warpingFleetsMap?.[key1]?.[key2] ?? [];
        // const fleetOwners = [...new Set(fleets.map(fleet => fleet.ownerId))];
        result.push([key1, world1Vec, key2, world2Vec, fleets.map(fleet => {
          const transitPosition = this.calculateTransitPosition(fleet);
          return {
            ...fleet,
            transitPosition
          }
        })]);
      }
    }
    return result;

  }

  public selectWorld(id: string | null) {
    this.selection.selectWorld(id)
  }

  public selectGate(id1: string, id2: string) {
    const [s1, s2] = [id1, id2].sort()
    this.selection.selectGate(s1, s2);
  }

  public selectFleet(id1: string) {
    this.selection.selectFleet(id1)
  }

  public hintForWorld(id: string): string | null {
    return this.worldHints.getHintForWorld(id);
  }

  public hintForGate(id1: string, id2: string) {
    return this.worldHints.getHintForGate(id1, id2)
  }

  private calculateTransitPosition(fleet: FleetInTransit): number {
    const now = this.clock.now;
    const warpDelay = this.gameData.gameRules.warping.warpToWorldDelay;
    switch (fleet.status) {
      case 'TRANSFERING_CARGO':
        return 1 - (fleet.arrivingTimestamp - now) / warpDelay;
      case 'WARPING':
        return 1 - (fleet.arrivingTimestamp - now) / warpDelay;
    }
  }

  public sendFleetToWorld(worldId: string) {
    this.orderEditor.newWarpOrderToWorld(worldId)
  }

  public sendFleetToGate(world1Id: string, world2Id: string) {
    this.orderEditor.startCargoMissionBetweenWorlds(world1Id, world2Id)
  }

  public setAltKeyState(state: boolean) {
    this.orderEditor.appendOrders = state;
  }

  public forwardInTime() {
    if (this.clock.fixedTimestamp) {
      this.clock.fixedTimestamp += this.environment.environmentInfo.millisecondsPerDay / 8
    }
  }

  public backwardInTime() {
    if (this.clock.fixedTimestamp) {
      this.clock.fixedTimestamp -= this.environment.environmentInfo.millisecondsPerDay / 8
    }
  }
}