import { observable } from "mobx";


export type WorldHint = {
  type: 'WORLD'
  worldId: string;
  hint: any;
} | {
  type: 'GATE'
  worldId1: string;
  worldId2: string;
  hint: any;
}

export class WorldHints {
  @observable private worldHintsById = new Map<string, any>();
  @observable private gateHintsById = new Map<string, any>();

  showHints(hints: WorldHint[]) {
    this.clearHints();
    hints.forEach(hint => {
      if (hint.type === 'WORLD') {
        this.worldHintsById.set(hint.worldId, hint.hint);
      }
      if (hint.type === 'GATE') {
        const gates = this.makeGateKey(hint.worldId1, hint.worldId2);
        this.gateHintsById.set(gates, hint.hint)
      }
    })
  }

  private makeGateKey(id1: string, id2: string) {
    return JSON.stringify([id1, id2].sort())
  }

  clearHints() {
    this.worldHintsById.clear()
    this.gateHintsById.clear()
  }

  getHintForWorld(id: string) {
    return this.worldHintsById.get(id) || null
  }

  getHintForGate(id1: string, id2: string) {
    const key = this.makeGateKey(id1, id2);
    return this.gateHintsById.get(key) || null
  }
}