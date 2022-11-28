import { Connector } from "@web3-react/types";
import { Chain } from "types";
import { convertChainObjectToMetaMaskParams } from "./index";


// provider.request returns Promise<any>, but wallet_switchEthereumChain must return null or throw
// see https://github.com/rekmarks/EIPs/blob/3326-create/EIPS/eip-3326.md for more info on wallet_switchEthereumChain
export const switchChain = async (connector: Connector, chain: Chain) => {
  // if (!isSupportedChain(chainId)) {
  //   throw new Error(`Chain ${chainId} not supported for connector (${typeof connector})`);
  // } else if (
  //   connector === walletConnectConnection.connector ||
  //   connector === networkConnection.connector
  // ) {
  //   await connector.activate(formatChainId(chain.chainId));
  // } else {
  const addChainParameter = convertChainObjectToMetaMaskParams(chain);
  await connector.activate(addChainParameter);
  // }
};
