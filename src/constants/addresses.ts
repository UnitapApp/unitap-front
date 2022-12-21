import { SupportedChainId } from './chains';

export type AddressMap = { [chainId: number]: string };

export const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';

export const MULTICALL_ADDRESS: AddressMap = {
  [SupportedChainId.GOERLI]: '0x85D395e783E1e5735B7bd66136D45Df194648EfB',
};

export const PASS_ADDRESS = '0xC99B2Fa525E1a0C17dB4fdE3540faA1575885A8B';