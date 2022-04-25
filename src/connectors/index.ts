import { ALL_SUPPORTED_CHAIN_IDS } from '../constants/chains';
import { InjectedConnector } from '@web3-react/injected-connector';

export const injected = new InjectedConnector({
  supportedChainIds: ALL_SUPPORTED_CHAIN_IDS,
});
