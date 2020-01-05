import { ServerTestBed } from "../../server-test-bed";

export async function createGame(testBed: ServerTestBed, gameId: string) {

  await testBed.sendMessage({
    type: 'COMMAND',
    command: {
      type: 'CREATE_GAME',
      gameId
    },
    commandId: 'create_game'
  })

  testBed.expectResponse({
    type: 'COMMAND_SUCCESS',
    commandId: 'create_game'
  });

  await testBed.sendMessage({
    type: 'BEGIN_SUBSCRIPTION',
    id: 'games',
    subscription: {
      type: 'GAMES'
    }
  })

  testBed.expectResponse({
    type: 'COMMAND_SUCCESS',
    commandId: 'create_game'
  });

  testBed.expectResponse({
    type: 'SUBSCRIPTION_RESULT',
    id: 'games',
    result: {
      type: 'GAMES',
      games: [{
        players: {
         'foobar': {
         } as any 
        },
        state: 'PROPOSED',
      }]
    }
  });
}