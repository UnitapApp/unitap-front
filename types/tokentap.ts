import { Chain, PK, Permission } from ".";

export type Token = {
  id: PK;
  name: string;
  distributor: string;
  distributorUrl: string;
  discordUrl: string;
  twitterUrl: string;
  imageUrl: string;
  token: string;
  tokenAddress: string;
  amount: number;
  createdAt: string;
  deadline: string;
  maxNumberOfClaims: number;
  numberOfClaims: number;
  notes: string;
  isExpired: boolean;
  isMaxedOut: boolean;
  isClaimable: boolean;
  tokenImageUrl?: string;
  contract?: string;
  chain: Chain;
  constraints: Permission[];
};

export type ClaimedToken = {
  id: PK;
  txHash?: string;
  userProfile: number;
  createdAt: string;
  status: string;
  tokenDistribution: Token;
  payload: TokenClaimPayload;
};

export type TokenClaimPayload = {
  userWalletAddress: `0x{string}`;
  amount: number;
  nonce: number;
  signature: `0x{string}`;
  token: `0x{string}`;
};

export type ClaimTokenResponse = {
  detail: string;
  signature: {
    status: string;
    createdAt: string;
    id: PK;
    payload: TokenClaimPayload;
    tokenDistribution: Token;
    userProfile: number;
  };
};
