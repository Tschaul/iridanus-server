import { ServerTestBed } from "../../server-test-bed";

export async function createGame(testBed: ServerTestBed, gameId: string) {

  await testBed.sendMessage({
    type: 'COMMAND',
    command: {
      type: 'GAME/CREATE',
      gameId
    },
    commandId: 'create_game'
  })

  testBed.expectCommandResponse({
    type: 'COMMAND_SUCCESS',
    commandId: 'create_game'
  });

}

export async function joinGame(testBed: ServerTestBed, gameId: string) {
  await testBed.sendMessage({
    type: 'COMMAND',
    command: {
      type: 'GAME/JOIN',
      gameId
    },
    commandId: 'join_game'
  })

  testBed.expectCommandResponse({
    type: 'COMMAND_SUCCESS',
    commandId: 'join_game'
  });
}
