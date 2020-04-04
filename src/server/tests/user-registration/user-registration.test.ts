
import { expect } from 'chai';
import { setupContainerRegistry } from '../setup-container-registry';
import { ContainerRegistry } from '../../container-registry';
import { ConnectionHandler } from '../../connection-handler';
import { ResponseMessage } from '../../../shared/messages/response-message';
import { signUpAndLogin } from './user-management.workflows';
import { ServerTestBed } from '../server-test-bed';

describe("user registration", () => {

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

  it("does sign up and login", async () => {

    await signUpAndLogin(testBed, 'foobar', '1234');

  })

})



