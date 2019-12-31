type QueueItem = () => Promise<void>;

export class Queue {
  private items = [] as QueueItem[];
  private running = false;

  add(item: QueueItem) {
    this.items.push(item);
    this.dequeue();
  }

  private dequeue() {
    if (this.running) {
      return;
    }
    const item = this.items.shift();
    if (item) {
      this.running = true;
      item().then(() => {
        this.running = false;
        this.dequeue();
      })
    } else {
      this.running = false;
    }
  }
}