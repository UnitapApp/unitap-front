export type PK = number;

export type Chain = {
  pk: PK;
  chainName: string;
  nativeCurrencyName: string;
  symbol: string;
  chainId: string;
  logoUrl: string;
  explorerUrl: string;
  rpcUrl: string;
  maxClaimAmount: number;
  claimed: string | number;
  unclaimed: string | number;
  decimals: number;
  fundManagerAddress: string;
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
