import { Container } from "inversify";
import { CounterDataProvider } from "./counter-data-provider";

export function registerGlobalDataProviders(container: Container) {
  container.bind(CounterDataProvider).toSelf();
}