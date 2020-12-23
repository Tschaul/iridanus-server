import { injectable } from "inversify";
import { GameRules } from "../shared/model/v1/rules";
import { GameState } from "../shared/model/v1/state";

@injectable()
export class GameSetupProvider {

  private rulesInternal: GameRules;

  public get rules(): GameRules {
    if (!this.rulesInternal) {
      throw new Error('Game config is not set yet.')
    }
    return this.rulesInternal;
  }

  public set rules(value: GameRules) {
    if (this.rulesInternal) {
      throw new Error('Game config is allready set.')
    }
    this.rulesInternal = value;
  }

  private initialStateInternal: GameState;

  public get initialState(): GameState {
    if (!this.initialStateInternal) {
      throw new Error('Initial state is not set yet.')
    }
    return this.initialStateInternal;
  }

  public set initialState(value: GameState) {
    if (this.initialStateInternal) {
      throw new Error('Initial state is allready set.')
    }
    this.initialStateInternal = value;
  }

  private gameIdInternal: string;

  public get gameId(): string {
    if (!this.gameIdInternal) {
      throw new Error('Game ID is not set yet.')
    }
    return this.gameIdInternal;
  }

  public set gameId(value: string) {
    if (this.gameIdInternal) {
      throw new Error('Game ID is allready set.')
    }
    this.gameIdInternal = value;
  }

  private activeSystemsInternal: string[];

  public get activeSystems(): string[] {
    if (!this.activeSystemsInternal) {
      throw new Error('Active systems are not set yet.')
    }
    return this.activeSystemsInternal;
  }

  public set activeSystems(value: string[]) {
    if (this.activeSystemsInternal) {
      throw new Error('Active systems are allready set.')
    }
    this.activeSystemsInternal = value;
  }

  public endGameLoopWhenNoEventIsQueued: boolean = false;
  public awaitClock: boolean = true;

}