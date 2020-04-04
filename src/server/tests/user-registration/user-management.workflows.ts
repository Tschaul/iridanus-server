import { ServerTestBed } from "../server-test-bed";

export async function signUpAndLogin(testBed: ServerTestBed, username: string, password: string) {

  testBed.logout();

  await testBed.sendMessage({
    type: 'COMMAND',
    command: {
      type: 'USER/SIGN_UP_USER',
      email: 'foo@bar.de',
      id: username,
      password: password
    },
    commandId: 'sign_up'
  })

  testBed.expectCommandResponse({
    type: 'COMMAND_SUCCESS',
    commandId: 'sign_up'
  });

  const token = testBed.getEmailConfirmationToken(username) as string;

  await testBed.sendMessage({
    type: 'COMMAND',
    command: {
      type: 'USER/CONFIRM_EMAIL_ADDRESS',
      id: username,
      token
    },
    commandId: 'confirm'
  })

  testBed.expectCommandResponse({
    type: 'COMMAND_SUCCESS',
    commandId: 'confirm'
  });

  await testBed.sendMessage({
    type: 'AUTHENTICATE',
    userId: username,
    password: password
  });

  testBed.expectAuthenticationResponse({
    type: 'AUTHENTICATION_SUCCESSFULL'
  });

  testBed.clearResponses();

}