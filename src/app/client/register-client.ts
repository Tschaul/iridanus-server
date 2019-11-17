import { Container } from "inversify";
import { SocketConnection } from "./socket-connection";

export function registerClient(container: Container) {
  container.bind(SocketConnection).toSelf();
}