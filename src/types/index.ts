export type Chain = {
  pk: number;
  chainName: string;
  nativeCurrencyName: string;
  symbol: string;
  chainId: string;
  logoUrl: string;
  explorerUrl: string;
  rpcUrl: string;
  maxClaimAmount: number;
  claimed: number;
  unclaimed: number;
  decimals: number;
};

export enum BrightIdVerificationStatus {
  PENDING = '0',
  VERIFIED = '1',
}

export type UserProfile = {
  pk: number;
  contextId: string;
  address: string;
  verificationUrl: string;
  verificationStatus: BrightIdVerificationStatus;
};
