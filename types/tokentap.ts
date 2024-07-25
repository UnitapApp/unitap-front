import { Address } from "viem";
import { Chain, PK, Permission } from ".";

export type Token = {
  constraintParams: string;
  id: PK;
  name: string;
  distributor: string;
  decimals?: number;
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
  numberOfOnchainClaims: number;
  notes: string;
  isExpired: boolean;
  isMaxedOut: boolean;
  isClaimable: boolean;
  tokenImageUrl?: string;
  contract?: string;
  status: "VERIFIED" | "PENDING" | "REJECTED";
  chain: Chain;
  constraints: Permission[];
  remainingClaimForUnitapPassUser: number | null;
  maxClaimNumberForUnitapPassUser: number | null;
  claimDeadlineForUnitapPassUser: string;
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
  userWalletAddress: Address;
  amount: number;
  nonce: number;
  signature: Address;
  token: Address;
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

// ------ signature types

type ResultType = {
  chain: string;
  contract: string;
  wallet: string;
  distributionId: bigint;
  claimId: bigint;
};

type SignParamType = {
  name?: string;
  type: string;
  value: string | number;
};

type OwnerPubKeyType = {
  x: string;
  yParity: string;
};

type SignatureType = {
  owner: Address;
  ownerPubKey: OwnerPubKeyType;
  timestamp: number;
  signature: Address;
};

type DataType = {
  uid: string;
  params: {
    claimId: string;
  };
  timestamp: number;
  result: ResultType;
  signParams: SignParamType[];
  init: {
    nonceAddress: Address;
  };
};

export type ShieldSignatureResponse = {
  success: boolean;
  result: {
    confirmed: boolean;
    reqId: Address;
    app: string;
    appId: string;
    method: string;
    nSign: bigint;
    gwAddress: string;
    data: DataType;
    startedAt: number;
    confirmedAt: number;
    signatures: SignatureType[];
    shieldAddress: Address;
    shieldSignature: Address;
    nodeSignature: Address;
  };
};
