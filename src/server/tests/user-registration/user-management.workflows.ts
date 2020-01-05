import { ServerTestBed } from "../../server-test-bed";

export async function signUpAndLogin(testBed: ServerTestBed, username: string, password: string) {

  await testBed.sendMessage({
    type: 'COMMAND',
    command: {
      type: 'SIGN_UP_USER',
      email: 'foo@bar.de',
      id: username,
      password: password
    },
    commandId: 'sign_up'
  })

  await testBed.sendMessage({
    type: 'AUTHENTICATE',
    userId: username,
    password: password
  });

  testBed.expectResponse({
    type: 'COMMAND_SUCCESS',
    commandId: 'sign_up'
  });

  testBed.expectResponse({
    type: 'AUTHENTICATION_SUCCESSFULL'
  });

  testBed.clearResponses();

}