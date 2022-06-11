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

export type ClaimReceipt = {
  pk: PK;
  chain: PK;
  datetime: string;
  amount: number;
};
