import { BehaviorSubject } from "rxjs";

type QueueItem = () => Promise<void>;

export class Queue {
  private items = [] as QueueItem[];
  private running$$ = new BehaviorSubject(false);
  public running$ = this.running$$.asObservable();

  add(item: QueueItem) {
    this.items.push(item);
    this.dequeue();
  }

  addJoined<TResult>(item: () => Promise<TResult>): Promise<TResult> {
    return new Promise((resolve, reject) => {
      this.add(async () => {
        try {
          const result = await item();
          resolve(result)
        } catch (error) {
          reject(error)
        }
      })
    })
  }

  private dequeue() {
    if (this.running$$.value) {
      return;
    }
    const item = this.items.shift();
    if (item) {
      this.running$$.next(true);
      item().then(() => {
        this.running$$.next(false);
        this.dequeue();
      })
    } else {
      this.running$$.next(false);
    }
  }
}