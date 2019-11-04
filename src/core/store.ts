import { Subject, Observable } from 'rxjs';
import { scan, startWith, tap, withLatestFrom, sample, publishReplay, publish, shareReplay } from 'rxjs/operators';
import { Action } from './actions/action';
import { State } from './state';

export class Store {
  private actions$$: Subject<Action> = new Subject();
  private commits$$: Subject<void> = new Subject();
  private lastState: State | null = null;
  public state$: Observable<State>;

  constructor(initialState: State) {

    this.state$ = this.actions$$.pipe(
      scan((state: State, action: Action) => {
        const nextState = action.apply(state);
        // console.log(nextState);
        return nextState;
      }, initialState),
      startWith(initialState),
      sample(this.commits$$),
      tap(state => {
        this.lastState = state
      }),
      shareReplay(1),
    )

  }

  public dispatch(action: Action) {
    this.actions$$.next(action);
  }

  public commit() {
    this.commits$$.next();
  }

  public finalize() {
    this.commits$$.complete();
    this.actions$$.complete();
    return this.lastState;
  }
}