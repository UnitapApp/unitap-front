import { Address } from "wagmi"
import { SupportedChainId } from "./chains"

export type AddressMap = { [chainId: number]: Address | undefined }

export const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000"

export const MULTICALL_ADDRESS: AddressMap = {
  [SupportedChainId.GOERLI]: "0x85D395e783E1e5735B7bd66136D45Df194648EfB",
}

export const UNITAP_PASS_BATCH_SALE_ADDRESS: AddressMap = {
  [SupportedChainId.GOERLI]: "0xC99B2Fa525E1a0C17dB4fdE3540faA1575885A8B",
  [SupportedChainId.MAINNET]: "0x4649b7d433ee4ba472fd76073b07f082d8b18e9b",
  [SupportedChainId.GNOSIS]: undefined,
}

export const UNITAP_PASS_ADDRESS: AddressMap = {
  [SupportedChainId.GOERLI]: "0x904018a4e9905021C1806A054E6EbD5796570131",
  [SupportedChainId.MAINNET]: "0x23826Fd930916718a98A21FF170088FBb4C30803",
  [SupportedChainId.GNOSIS]: undefined,
}

export const UNITAP_TOKEN_TAP_ADDRESS: AddressMap = {
  [SupportedChainId.GNOSIS]: "0xB67ec856346b22e4BDA2ab2B53d70D61a2014358",
}

export const getSupportedChainId = () =>
  // process.env.IS_STAGE ? SupportedChainId.GOERLI : SupportedChainId.MAINNET
  SupportedChainId.MAINNET

export const getPassBatchSaleAddress = () =>
  // process.env.IS_STAGE
  // ? UNITAP_PASS_BATCH_SALE_ADDRESS[SupportedChainId.GOERLI]
  // :
  UNITAP_PASS_BATCH_SALE_ADDRESS[SupportedChainId.MAINNET]
