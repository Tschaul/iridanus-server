
import { expect } from 'chai';
import { setupContainerRegistry } from '../setup-container-registry';
import { ContainerRegistry } from '../../container-registry';
import { ConnectionHandler } from '../../connection-handler';
import { ResponseMessage } from '../../../shared/messages/response-message';
import { ServerTestBed } from '../../server-test-bed';
import { signUpAndLogin } from '../user-registration/user-management.workflows';
import { createGame, joinGame } from './game-setup.workflows';
import { anything } from '../mocks/anything';

describe.only("user registration", () => {

  let containerRegistry: ContainerRegistry;
  let testBed: ServerTestBed;

  beforeEach(async () => {
    const setup = setupContainerRegistry();
    containerRegistry = setup.containerRegistry;
    testBed = new ServerTestBed(containerRegistry);
    await testBed.prepare()
  })

  afterEach(async () => {
    await testBed.cleanup();
  })

  it("creates game", async () => {

    await signUpAndLogin(testBed, 'foobar', '1234');

    await createGame(testBed, 'game1');

    await testBed.sendMessage({
      type: 'BEGIN_SUBSCRIPTION',
      id: 'games',
      subscription: {
        type: 'GAME/LIST'
      }
    })

    testBed.expectSubscriptionResponse({
      type: 'SUBSCRIPTION_RESULT',
      id: 'games',
      result: {
        type: 'GAME/LIST',
        games: [{
          id: 'game1',
          players: {
            'foobar': anything
          },
          state: 'PROPOSED',
        }]
      }
    });

    await signUpAndLogin(testBed, 'barbaz', '1234');

    await joinGame(testBed, 'game1');

    testBed.expectSubscriptionResponse({
      type: 'SUBSCRIPTION_RESULT',
      id: 'games',
      result: {
        type: 'GAME/LIST',
        games: [{
          id: 'game1',
          players: {
            'foobar': anything,
            'barbaz': anything,
          },
          state: 'PROPOSED',
        }]
      }
    });

  })

})



