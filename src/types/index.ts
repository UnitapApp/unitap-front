export type PK = number;

export type Chain = {
  pk: PK;
  chainName: string;
  nativeCurrencyName: string;
  symbol: string;
  chainId: string;
  logoUrl: string;
  modalUrl: string;
  explorerUrl: string;
  rpcUrl: string;
  maxClaimAmount: number;
  claimed: string | number;
  unclaimed: string | number;
  decimals: number;
  fundManagerAddress: string;
  totalClaims: number;
  totalClaimsSinceLastMonday: number;
  isTestnet: boolean;
  chainType: string;
  needsFunding: boolean;
};

export enum BrightIdVerificationStatus {
  PENDING = '0',
  VERIFIED = '1',
}

export type UserProfile = {
  pk: PK;
  contextId: string;
  address: string;
  verificationUrl: string;
  verificationStatus: BrightIdVerificationStatus;
  totalWeeklyClaimsRemaining: number;
};

export enum ClaimReceiptState {
  PENDING = '0',
  VERIFIED = '1',
  REJECTED = '2',
}

export enum ClaimBoxState {
  CLOSED = '-5',
  WALLET_NOT_CONNECTED = '-4',
  BRIGHTID_NOT_VERIFIED = '-3',
  INITIAL = '-2',
  REQUEST = '-1',
  PENDING = '0',
  VERIFIED = '1',
  REJECTED = '2',
}

export type ClaimReceipt = {
  pk: PK;
  txHash: string | null;
  chain: PK;
  datetime: string;
  // amount: BigInt;
  amount: number;
  status: ClaimReceiptState;
};

export type ClaimBoxStateContainer = {
  status: ClaimBoxState;
  lastFailPk: number | null;
};

export enum BrightIdModalState {
  CLOSED = '0',
  OPENED = '1',
  NOT_CONNECTED = '2',
  CONNECTED_NOT_VERIFIED = '3',
  CONNECTED_AND_VERIFIED = '4',
}

export enum TransactionState {
  IDLE = '0',
  PENDING = '1',
  ACCEPTED = '2',
  FAILED = '3',
}

export enum HaveBrightIdAccountModalState {
  CLOSED = '0',
  OPENED = '1',
}

export enum BrightIdConnectionModalState {
  CLOSED = '0',
  OPENED = '1',
}

export enum Network {
  MAINNET = '0',
  TESTNET = '1',
}

export enum ChainType { 
  EVM = '0',
  NONEVM = '1',
}
