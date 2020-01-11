import { Container, interfaces } from "inversify";
import { registerClient } from "./client/register-client";

let container: Container;

export function setupContainerRegistry() {

  container = new Container({
    defaultScope: "Singleton"
  });

  registerClient(container);
}

export function resolveFromRegistry<T>(type: interfaces.ServiceIdentifier<T>): T {
  return container.get(type);
}