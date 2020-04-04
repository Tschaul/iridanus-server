import { ContainerRegistry } from "../container-registry";
import { CryptoWrapperMock } from "./mocks/crypto-warpper-mock";
import { CryptoWrapper } from "../infrastructure/crypto/crypto-wrapper";
import { registerMailMocks } from "./mocks/mail-mocks";

export function setupContainerRegistry() {
  const containerRegistry =  new ContainerRegistry({
    dataPath: './temp',
    millisecondsPerDay: 5000,
    mailSettings: undefined as any,
    baseUrl: 'http://test'
  });

  containerRegistry.globalContainer.unbind(CryptoWrapper);
  containerRegistry.globalContainer.bind(CryptoWrapper).to(CryptoWrapperMock as any);

  registerMailMocks(containerRegistry.globalContainer);

  return {
    containerRegistry,
  };
}