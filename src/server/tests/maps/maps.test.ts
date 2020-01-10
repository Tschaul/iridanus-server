
import { setupContainerRegistry } from '../setup-container-registry';
import { ContainerRegistry } from '../../container-registry';
import { ServerTestBed } from '../../server-test-bed';
import { signUpAndLogin } from '../user-registration/user-management.workflows';
import { MapSchema } from '../../repositories/maps/schema/v1';

describe("user registration", () => {


  const map1data: MapSchema = {
    version: 1,
    map: {
      id: 'map1',
      final: true,
      initialState: undefined as any,
      name: 'Awesome Map',
      seats: []
    }
  }

  const map2data: MapSchema = {
    version: 1,
    map: {
      id: 'map2',
      final: false,
      initialState: undefined as any,
      name: 'Another Map',
      seats: []
    }
  }

  let containerRegistry: ContainerRegistry;
  let testBed: ServerTestBed;

  beforeEach(async () => {
    const setup = setupContainerRegistry();
    containerRegistry = setup.containerRegistry;
    testBed = new ServerTestBed(containerRegistry);
    await testBed.prepare()

    await signUpAndLogin(testBed, 'foobar', '1234');
    testBed.clearResponses()

    await testBed.putData('maps/map1/map.json', map1data)
    await testBed.putData('maps/map2/map.json', map2data)
  })

  afterEach(async () => {
    await testBed.cleanup();
  })

  it('gets all maps', async () => {

    testBed.sendMessage({
      type: 'BEGIN_SUBSCRIPTION',
      id: 'all_maps',
      subscription: {
        type: 'MAP/LIST_ALL'
      },
    })

    testBed.expectSubscriptionResponse({
      type: 'SUBSCRIPTION_RESULT',
      id: 'all_maps',
      result: {
        type: 'MAP/LIST_ALL',
        maps: [map1data.map, map2data.map]
      }
    })

  })

})



