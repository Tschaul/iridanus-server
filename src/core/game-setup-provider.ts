import { injectable } from "inversify";
import { GameRules } from "./rules";
import { GameState } from "./state";

@injectable()
export class GameSetupProvider {

  private configInternal: GameRules;

  public get rules(): GameRules {
    if (!this.configInternal) {
      throw new Error('Game config is not set yet.')
    }
    return this.configInternal;
  }

  public set rules(value: GameRules) {
    if (this.configInternal) {
      throw new Error('Game config is allready set.')
    }
    this.configInternal = value;
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

}