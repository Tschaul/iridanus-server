
import { setupContainerRegistry } from '../setup-container-registry';
import { ContainerRegistry } from '../../container-registry';
import { ServerTestBed } from '../../server-test-bed';
import { signUpAndLogin } from '../user-registration/user-management.workflows';
import { anything } from '../mocks/anything';
import { MapSchema } from '../../repositories/maps/schema/v1';

describe("user registration", () => {

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

  it('throws when selecting a map that does not exist', async () => {

    await testBed.sendMessage({
      type: 'COMMAND',
      command: {
        type: 'GAME/SET_MAP',
        gameId: 'game1',
        mapId: 'does_not_exist'
      },
      commandId: 'set_map'
    })

    testBed.expectErrorResponse({
      type: 'ERROR',
      error: anything
    })
  })

  it('selects a map that does exist', async () => {

    const map: MapSchema = {
      version: 1,
      map: {
        id: 'map1',
        final: true,
        initialState: undefined as any,
        name: 'Awesome Map',
        seats: []
      }
    }

    await testBed.putData('maps/map1/map.json', map)

    await testBed.sendMessage({
      type: 'COMMAND',
      command: {
        type: 'GAME/SET_MAP',
        gameId: 'game1',
        mapId: 'map1'
      },
      commandId: 'set_map'
    })

    testBed.expectCommandResponse({
      type: 'COMMAND_SUCCESS',
      commandId: 'set_map'
    })
  })

  it('throws when selecting a map that is not finalized', async () => {

    const map: MapSchema = {
      version: 1,
      map: {
        id: 'map1',
        final: false,
        initialState: undefined as any,
        name: 'Awesome Map',
        seats: []
      }
    }

    await testBed.putData('maps/map1/map.json', map)

    await testBed.sendMessage({
      type: 'COMMAND',
      command: {
        type: 'GAME/SET_MAP',
        gameId: 'game1',
        mapId: 'map1'
      },
      commandId: 'set_map'
    })

    testBed.expectErrorResponse({
      type: 'ERROR',
      error: anything,
      commandId: 'set_map'
    })
  })

})



