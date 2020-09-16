import { makeId } from "../app/client/make-id";
import { ContainerRegistry } from "./container-registry";
import { GameRepository } from "./repositories/games/games-repository";

export async function createTestGame(containerRegistry: ContainerRegistry) {
  const gameRepository = containerRegistry.globalContainer.get(GameRepository);

  const gameId = makeId(10);

  await gameRepository.createGame(gameId)

  await gameRepository.joinGame(gameId, 'tschaul')
  await gameRepository.joinGame(gameId, 'foobar')
  await gameRepository.joinGame(gameId, 'knalltuete')

  await gameRepository.setReady(gameId, 'tschaul')
  await gameRepository.setReady(gameId, 'foobar')
  await gameRepository.setReady(gameId, 'knalltuete')

  console.log("CREATED TEST GAME "+ gameId);
}