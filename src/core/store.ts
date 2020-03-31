import { Subject, Observable, throwError, concat, ReplaySubject } from 'rxjs';
import { scan, startWith, tap, withLatestFrom, sample, publishReplay, publish, shareReplay, map } from 'rxjs/operators';
import { injectable, inject } from 'inversify';
import { Action } from './actions/action';
import { GameState } from '../shared/model/v1/state';
import { GameSetupProvider } from './game-setup-provider';
import { GameStateValidator } from './infrastructure/game- state-message-validator';
import { Clock } from './infrastructure/clock';
import { Logger } from './infrastructure/logger';
import { ActionLogger } from './infrastructure/action-logger';
import { setTimestamp } from './actions/set-timestamp';

@injectable()
export class Store {
  private actions$$: Subject<Action> = new Subject();
  private commits$$: Subject<void> = new Subject();
  private finalized$$: Subject<void> = new Subject();
  private lastState: GameState | null = null;

  private currentTransaction: Action[] = [];

  private stateInternal$$ = new ReplaySubject<GameState>(1);

  public state$: Observable<GameState> = this.stateInternal$$.pipe(shareReplay(1));
  public finalized$: Observable<void> = this.finalized$$;

  public actionLog$: Observable<string> = this.actions$$.pipe(
    map(action => action.describe()),
    shareReplay(1)
  );

  constructor(
    private setup: GameSetupProvider,
    private validator: GameStateValidator,
    private logger: ActionLogger
  ) {
  }

  public async initialize() {
    await this.validator.initialize();

    this.actions$$.pipe(
      scan((state: GameState, action: Action) => {
        this.logger.logAction(action);
        const nextState = action.apply(state);
        return nextState;
      }, this.setup.initialState),
      sample(this.commits$$),
      startWith(this.setup.initialState),
      tap(state => {
        this.lastState = state;
        this.validator.assertGameStateValid(state)
      }),
    ).subscribe(state => this.stateInternal$$.next(state))

  }

  public dispatch(action: Action) {
    this.currentTransaction.push(action);
  }

  public commit(timestamp: number) {
    const setTimestampAction = setTimestamp(timestamp);
    this.actions$$.next(setTimestampAction);
    this.currentTransaction.forEach(action => this.actions$$.next(action));
    this.currentTransaction = [];
    this.commits$$.next();
  }

  public finalize() {
    this.commits$$.complete();
    this.actions$$.complete();
    this.finalized$$.next();
    this.finalized$$.complete();
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