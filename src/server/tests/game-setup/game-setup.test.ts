
import { setupContainerRegistry } from '../setup-container-registry';
import { ContainerRegistry } from '../../container-registry';
import { signUpAndLogin } from '../user-registration/user-management.workflows';
import { anything } from '../mocks/anything';
import { ServerTestBed } from '../server-test-bed';

describe("game setup", () => {

  let containerRegistry: ContainerRegistry;
  let testBed: ServerTestBed;

  beforeEach(async () => {
    const setup = setupContainerRegistry();
    containerRegistry = setup.containerRegistry;
    testBed = new ServerTestBed(containerRegistry);
    await testBed.prepare()

    await signUpAndLogin(testBed, 'foobar', '1234');

    await testBed.sendMessage({
      type: 'COMMAND',
      command: {
        type: 'GAME/CREATE',
        gameId: 'game1'
      },
      commandId: 'create_game'
    })

    testBed.expectCommandResponse({
      type: 'COMMAND_SUCCESS',
      commandId: 'create_game'
    });

    testBed.clearResponses()
  })

  afterEach(async () => {
    await testBed.cleanup();
  })

  it("creates game and someone joins", async () => {

    await testBed.sendMessage({
      type: 'BEGIN_SUBSCRIPTION',
      id: 'games',
      subscription: {
        type: 'GAME/LIST_ALL'
      }
    })

    testBed.expectSubscriptionResponse({
      type: 'SUBSCRIPTION_RESULT',
      id: 'games',
      result: {
        type: 'GAME/LIST_ALL',
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

    await testBed.sendMessage({
      type: 'COMMAND',
      command: {
        type: 'GAME/JOIN',
        gameId: 'game1'
      },
      commandId: 'join_game'
    })

    testBed.expectCommandResponse({
      type: 'COMMAND_SUCCESS',
      commandId: 'join_game'
    });

    testBed.expectSubscriptionResponse({
      type: 'SUBSCRIPTION_RESULT',
      id: 'games',
      result: {
        type: 'GAME/LIST_ALL',
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



