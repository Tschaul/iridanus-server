export interface WrappedObservable<TProp> {
  get(): TProp,
  set(value: TProp): void
}

export function wrapObservable<TModel, TKey extends keyof TModel>(model: TModel, key: TKey): WrappedObservable<TModel[TKey]> {
  return {
    get() {
      return model[key];
    },
    set(value: TModel[TKey]) {
      model[key] = value;
    }
  }
}