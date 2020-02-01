import { injectable } from "inversify";
import { DataHandleRegistry } from "../data-handle-registry";
import { ReplaySubject, Observable } from "rxjs";
import { RulesSchema } from "./schema/v1";
import { take, map } from "rxjs/operators";
import { Initializer } from "../../commands/infrastructure/initialisation/initializer";

const BASE_FOLDER = 'rules'

const pathById = (ruleId: string) => `${BASE_FOLDER}/${ruleId}/rules.json`;

@injectable()
export class RulesRepository {

  private _data$ = new ReplaySubject<RulesSchema[]>(1);

  constructor(private dataHandleRegistry: DataHandleRegistry, initializer: Initializer) {
    initializer.requestInitialization(this.initialize());
  }

  private async initialize() {
    const ruleIds = await this.dataHandleRegistry.listDirectories(BASE_FOLDER);

    const data = [] as RulesSchema[];

    for (const ruleId of ruleIds) {
      const handle = await this.handleForRuleId(ruleId);
      const rules = await handle.read();
      data.push(rules);
    }

    this._data$.next(data);
  }

  private handleForRuleId(ruleId: string) {
    return this.dataHandleRegistry.getDataHandle<RulesSchema>(pathById(ruleId));
  }

  public getAllRules() {
    return this._data$.pipe(take(1)).toPromise();
  }

  public allRulesAsObservable() {
    return this._data$.pipe(map(rulesData => rulesData.map(data => data.rules)));
  }

  public async getRuleById(ruleId: string) {
    const handle = await this.handleForRuleId(ruleId);
    const data = await handle.read();
    return data.rules;
  }
}