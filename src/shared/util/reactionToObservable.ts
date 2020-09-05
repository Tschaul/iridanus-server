import { reaction } from "mobx";
import { Observable, Observer } from "rxjs";
import deepEqual from "deep-equal";

export function reactionToObservable<T>(get: () => T, options: { deepEqual?: boolean } = {}): Observable<T> {
  return Observable.create((observer: Observer<T>) => {
    return reaction(
      get,
      (arg, r) => {
        observer.next(arg)
      },
      {
        fireImmediately: true,
        onError: (e) => observer.error(e),
        equals: options.deepEqual ? deepEqual : undefined
      }
    )
  })
}