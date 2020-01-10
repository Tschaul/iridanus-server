
import { setupContainerRegistry } from '../setup-container-registry';
import { ContainerRegistry } from '../../container-registry';
import { ServerTestBed } from '../../server-test-bed';
import { signUpAndLogin } from '../user-registration/user-management.workflows';
import { RulesSchema } from '../../repositories/rules/schema/v1';

describe("user registration", () => {


  const rules1data: RulesSchema = {
    version: 1,
    rules: {
      id: 'rules1',
      name: 'Awesome Ruleset',
      rules: undefined as any,
      final: true,
    }
  }

  const rules2data: RulesSchema = {
    version: 1,
    rules: {
      id: 'rules2',
      name: 'Another Ruleset',
      rules: undefined as any,
      final: false,
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

    await testBed.putData('rules/rules1/rules.json', rules1data)
    await testBed.putData('rules/rules2/rules.json', rules2data)
  })

  afterEach(async () => {
    await testBed.cleanup();
  })

  it('gets all rules', async () => {

    await testBed.sendMessage({
      type: 'BEGIN_SUBSCRIPTION',
      id: 'all_rules',
      subscription: {
        type: 'RULES/LIST_ALL'
      },
    })

    testBed.expectSubscriptionResponse({
      type: 'SUBSCRIPTION_RESULT',
      id: 'all_rules',
      result: {
        type: 'RULES/LIST_ALL',
        rules: [rules1data.rules, rules2data.rules]
      }
    })

  })

  it('gets all finalized rules', async () => {

    await testBed.sendMessage({
      type: 'BEGIN_SUBSCRIPTION',
      id: 'final_rules',
      subscription: {
        type: 'RULES/LIST_FINAL'
      },
    })

    testBed.expectSubscriptionResponse({
      type: 'SUBSCRIPTION_RESULT',
      id: 'final_rules',
      result: {
        type: 'RULES/LIST_FINAL',
        rules: [rules1data.rules]
      }
    })

  })

})



