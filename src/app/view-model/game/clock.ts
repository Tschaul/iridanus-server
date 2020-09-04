import { observable } from "mobx";

export class GameClock {
  
  @observable public now = new Date().getTime();
  interval: NodeJS.Timeout;

  focus() {
    this.now = new Date().getTime()
    this.interval = setInterval(() => {
      this.now = new Date().getTime()
    }, 1000)
  }

  unfocus() {
    clearInterval(this.interval)
  }
}