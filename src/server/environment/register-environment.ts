import { Container } from "inversify";
import { Environment } from "./environment";

export function registerEnvironment(container: Container) {
  container.bind(Environment).toConstantValue(environment)
}

const environment: Environment = {
  dataPath: './data'
}