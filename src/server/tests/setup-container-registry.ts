import { ContainerRegistry } from "../container-registry";
import { DataHandleRegistry } from "../repositories/data-handle-registry";
import { DataHandleRegistryMock } from "./mocks/data-handle-registry-mock";
import { CryptoWrapper } from "../commands/infrastructure/crypto/crypto-wrapper";
import { CryptoWrapperMock } from "./mocks/crypto-warpper-mock";
import { Environment } from "../environment/environment";

export function setupContainerRegistry() {
  const containerRegistry =  new ContainerRegistry();

  // containerRegistry.globalContainer.unbind(DataHandleRegistry);
  // containerRegistry.globalContainer.bind(DataHandleRegistry).to(DataHandleRegistryMock as any);

  containerRegistry.globalContainer.unbind(Environment);
  containerRegistry.globalContainer.bind(Environment).toConstantValue({
    dataPath: './temp'
  })

  containerRegistry.globalContainer.unbind(CryptoWrapper);
  containerRegistry.globalContainer.bind(CryptoWrapper).to(CryptoWrapperMock as any);

  return {
    containerRegistry,
  };
}