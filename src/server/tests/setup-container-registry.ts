import { ContainerRegistry } from "../container-registry";
import { DataHandleRegistry } from "../repositories/data-handle-registry";
import { DataHandleRegistryMock } from "./mocks/data-handle-registry-mock";
import { CryptoWrapperMock } from "./mocks/crypto-warpper-mock";
import { Environment } from "../environment/environment";
import { CryptoWrapper } from "../infrastructure/crypto/crypto-wrapper";

export function setupContainerRegistry() {
  const containerRegistry =  new ContainerRegistry();

  // containerRegistry.globalContainer.unbind(DataHandleRegistry);
  // containerRegistry.globalContainer.bind(DataHandleRegistry).to(DataHandleRegistryMock as any);

  containerRegistry.globalContainer.unbind(Environment);
  containerRegistry.globalContainer.bind(Environment).toConstantValue({
    dataPath: './temp',
    millisecondsPerDay: 5000
  })

  containerRegistry.globalContainer.unbind(CryptoWrapper);
  containerRegistry.globalContainer.bind(CryptoWrapper).to(CryptoWrapperMock as any);

  return {
    containerRegistry,
  };
}