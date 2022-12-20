import { JsonRpcProvider } from '@ethersproject/providers';
import { RPC_URLS } from 'constants/networks';

import { SupportedChainId } from './chains';

export const Providers: { [key in SupportedChainId]: JsonRpcProvider } = {
  [SupportedChainId.MAINNET]: new JsonRpcProvider(RPC_URLS[SupportedChainId.MAINNET]),
  [SupportedChainId.RINKEBY]: new JsonRpcProvider(RPC_URLS[SupportedChainId.RINKEBY]),
  [SupportedChainId.GOERLI]: new JsonRpcProvider(RPC_URLS[SupportedChainId.GOERLI]),
};
