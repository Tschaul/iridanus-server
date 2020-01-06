import { ServerTestBed } from "../../server-test-bed";
import { expect } from "chai";
import { SubscriptionResult, GamesSubscriptionResult } from "../../../shared/messages/subscription-result";
import { SubscriptionResponse } from "../../../shared/messages/response-message";

export async function createGame(testBed: ServerTestBed, gameId: string) {

  await testBed.sendMessage({
    type: 'COMMAND',
    command: {
      type: 'GAME/CREATE',
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
      type: 'GAME/LIST'
    }
  })

  testBed.expectResponse({
    type: 'SUBSCRIPTION_RESULT',
    id: 'games',
    result: {
      type: 'GAME/LIST',
      games: [{
        id: gameId,
        players: {
         'foobar': () => true 
        },
        state: 'PROPOSED',
      }]
    }
  });

}