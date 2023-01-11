import { SupportedChainId } from './chains';

export type AddressMap = { [chainId: number]: string };

export const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';

export const MULTICALL_ADDRESS: AddressMap = {
  [SupportedChainId.GOERLI]: '0x85D395e783E1e5735B7bd66136D45Df194648EfB',
};

export const UNITAP_PASS_BATCH_SALE_ADDRESS: AddressMap = {
  [SupportedChainId.GOERLI]: '0xC99B2Fa525E1a0C17dB4fdE3540faA1575885A8B',
  [SupportedChainId.MAINNET]: '0x4649b7d433ee4ba472fd76073b07f082d8b18e9b',
};

export const UNITAP_PASS_ADDRESS: AddressMap = {
  [SupportedChainId.GOERLI]: '0x904018a4e9905021C1806A054E6EbD5796570131',
  [SupportedChainId.MAINNET]: '0x4ADc8CC149A03F44386Bee80bab36F9e8022b195',
};
