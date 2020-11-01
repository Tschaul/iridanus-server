import { autorun, observable } from "mobx";

export class GameClock {
  
  @observable public now = new Date().getTime();
  interval: NodeJS.Timeout;

  @observable public fixedTimestamp: number | null = null;

  constructor() {
    autorun(() => { if (this.fixedTimestamp) { this.now = this.fixedTimestamp}})
  }

  focus() {
    this.now = new Date().getTime()
    this.interval = setInterval(() => {
      this.now = this.fixedTimestamp ?? new Date().getTime()
    }, 1000)
  }

  unfocus() {
    clearInterval(this.interval)
  }

}