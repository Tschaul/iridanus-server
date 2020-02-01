import { Subject, Observable, throwError, concat, ReplaySubject } from 'rxjs';
import { scan, startWith, tap, withLatestFrom, sample, publishReplay, publish, shareReplay } from 'rxjs/operators';
import { injectable, inject } from 'inversify';
import { Action } from './actions/action';
import { GameState } from '../shared/model/v1/state';
import { GameSetupProvider } from './game-setup-provider';

@injectable()
export class Store {
  private actions$$: Subject<Action> = new Subject();
  private commits$$: Subject<void> = new Subject();
  private lastState: GameState | null = null;

  private stateInternal$$ = new ReplaySubject<GameState>(1);

  public state$: Observable<GameState> = this.stateInternal$$;

  constructor(private setup: GameSetupProvider) { 
  }

  public initialize() {
    this.actions$$.pipe(
      scan((state: GameState, action: Action) => {
        const nextState = action.apply(state);
        return nextState;
      }, this.setup.initialState),
      sample(this.commits$$),
      startWith(this.setup.initialState),
      tap(state => {
        this.lastState = state
      }),
    ).subscribe(state => this.stateInternal$$.next(state))
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

@injectable()
export class ReadonlyStore {

  public state$: Observable<GameState>;

  constructor(private store: Store) {
    this.state$ = store.state$;
  }
}