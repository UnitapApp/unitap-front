import { initializeConnector, Web3ReactHooks } from "@web3-react/core";
import { GnosisSafe } from "@web3-react/gnosis-safe";
import { MetaMask } from "@web3-react/metamask";
import { Connector } from "@web3-react/types";

export enum ConnectionType {
  INJECTED = "INJECTED",
  // NETWORK = 'NETWORK',
  GNOSIS_SAFE = "GNOSIS_SAFE",
}

export interface Connection {
  connector: Connector;
  hooks: Web3ReactHooks;
  type: ConnectionType;
}

function onError(error: Error) {
  console.debug(`web3-react error: ${error}`);
}

//
// const [web3Network, web3NetworkHooks] = initializeConnector<Network>(
//   (actions) => new Network({ actions, urlMap: RPC_URLS, defaultChainId: SupportedChainId.GOERLI }),
// );
// export const networkConnection: Connection = {
//   connector: web3Network,
//   hooks: web3NetworkHooks,
//   type: ConnectionType.NETWORK,
// };

const [web3Injected, web3InjectedHooks] = initializeConnector<MetaMask>(
  (actions) => new MetaMask({ actions, onError })
);
export const injectedConnection: Connection = {
  connector: web3Injected,
  hooks: web3InjectedHooks,
  type: ConnectionType.INJECTED
};

const [web3GnosisSafe, web3GnosisSafeHooks] = initializeConnector<GnosisSafe>((actions) => new GnosisSafe({ actions }));
export const gnosisSafeConnection: Connection = {
  connector: web3GnosisSafe,
  hooks: web3GnosisSafeHooks,
  type: ConnectionType.GNOSIS_SAFE
};
