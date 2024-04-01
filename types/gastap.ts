import { Address } from "viem";
import { PK } from ".";

export enum Network {
  MAINNET = "0",
  TESTNET = "1",
  ALL = "2",
}

export enum ChainType {
  EVM = "EVM",
  NONEVM = "NONEVM",
  NONEVMXDC = "NONEVMXDC",
  SOLANA = "Solana",
  LIGHTNING = "Lightning",
  ALL = "ALL",
}

export type Faucet = {
  pk: number;
  chain: ChainApi;
  fundManagerAddress: string;
  gasImageUrl: string;
  maxClaimAmount: number;
  totalClaims: number;
  totalClaimsThisRound: number;
  tokentapContractAddress: string | null;
  needsFunding: boolean;
  blockScanAddress: string;
  isOneTimeClaim: boolean;
  currentFuelLevel: number;
  isDeprecated: boolean;
  remainingClaimNumber: number;
};

export type ChainApi = {
  pk: number;
  chainName: string;
  chainId: string;
  nativeCurrencyName: string;
  symbol: string;
  decimals: number;
  explorerUrl: string;
  rpcUrl: string;
  logoUrl: string;
  modalUrl: string;
  isTestnet: boolean;
  chainType: string;
};

export type Chain = {
  pk: PK;
  chainName: string;
  chainPk: PK;
  nativeCurrencyName: string;
  symbol: string;
  chainId: string;
  logoUrl: string;
  modalUrl: string;
  explorerUrl: string;
  rpcUrl: string;
  maxClaimAmount: number;
  decimals: number;
  fundManagerAddress: Address;
  totalClaims: number;
  gasImageUrl: string;
  totalClaimsThisRound: number;
  isTestnet: boolean;
  chainType: string;
  needsFunding: boolean;
  blockScanAddress: string;
  tokentapContractAddress?: string;
  isOneTimeClaim: boolean;
  currentFuelLevel: number;
  isDeprecated: boolean;
  remainingClaimNumber: number;
};

export enum ClaimReceiptState {
  PENDING = "Pending",
  VERIFIED = "Verified",
  REJECTED = "Rejected",
}

export type ClaimReceipt = {
  pk: PK;
  txHash: string | null;
  chain: Chain;
  datetime: string;
  amount: number;
  status: ClaimReceiptState;
};

export enum ClaimBoxState {
  CLOSED = "-5",
  WALLET_NOT_CONNECTED = "-4",
  BRIGHTID_NOT_VERIFIED = "-3",
  BRIGHTID_NOT_CONNECTED = "-6",
  INITIAL = "-2",
  REQUEST = "-1",
  PENDING = "0",
  VERIFIED = "1",
  REJECTED = "2",
}

export enum ClaimNonEVMModalState {
  CLOSED = "0",
  OPENED = "1",
}

export type ClaimBoxStateContainer = {
  status: ClaimBoxState;
  lastFailPk: number | null;
};

export type FuelChampion = {
  faucetPk: string;
  username: string;
};
