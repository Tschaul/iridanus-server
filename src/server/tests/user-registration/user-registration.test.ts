
import { expect } from 'chai';
import { setupContainerRegistry } from '../setup-container-registry';
import { ContainerRegistry } from '../../container-registry';
import { ConnectionHandler } from '../../connection-handler';
import { ResponseMessage } from '../../../shared/messages/response-message';
import { ServerTestBed } from '../../server-test-bed';

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

    await testBed.sendMessage({
      type: 'COMMAND',
      command: {
        type: 'SIGN_UP_USER',
        email: 'foo@bar.de',
        id:  'foobar',
        password: '1234'
      }
    })

    await testBed.sendMessage({
      type: 'AUTHENTICATE',
      userId:'foobar',
      password: '1234'
    });

    expect(testBed.responses).to.deep.include({
      type: 'AUTHENTICATION_SUCCESSFULL'
    })

  })

})



