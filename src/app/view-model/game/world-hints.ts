import { observable } from "mobx";

export type WorldHint = {
  worldId: string;
  hint: string;
}

export class WorldHints {
  @observable private worldHintsById = new Map<string,string>();

  showHints(hints: WorldHint[]) {
    this.clearHints();
    hints.forEach(hint => {
      this.worldHintsById.set(hint.worldId, hint.hint);
    })
  }

  clearHints() {
    this.worldHintsById.clear()
  }

  getHintForWorld(id: string): string| null {
    return this.worldHintsById.get(id) || null
  }
}