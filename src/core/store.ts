import { Subject, Observable } from 'rxjs';
import { scan, startWith, tap, withLatestFrom, sample, publishReplay, publish, shareReplay } from 'rxjs/operators';
import { Action } from './actions/action';
import { State } from './state';

export class Store {
  private actions$$: Subject<Action> = new Subject();
  private commits$$: Subject<void> = new Subject();
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
      tap(_ => {
      }),
      shareReplay(1),
    )

  }

  public dispatch(action: Action) {
    console.log(action);
    this.actions$$.next(action);
  }

  public commit() {
    this.commits$$.next();
  }
}