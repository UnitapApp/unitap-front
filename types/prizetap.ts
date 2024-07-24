import { Address } from "viem";
import { Chain, PK, Permission, UserProfile, UserRafflesProps } from ".";

export type LineaRaffleEntry = {
  id: number;
  walletAddress: string;
  isWinner: boolean;
  claimTx: string;
  raffle: number;
  claimingPrizeTx: Address | null;
  selectedRaffleCh?: UserRafflesProps | null;
};

export type Prize = {
  id: PK;
  pk: PK;
  constraintParams: string;
  constraints: Permission[];
  imageUrl: string;
  tokenUri: string;
  background: string;
  creator: string;
  creatorUrl: string;
  contract: string;
  isPrizeNft: boolean;
  twitterUrl: string;
  decimals: number;
  discordUrl: string;
  description: string;
  createdAt: string;
  deadline: string;
  name: string;
  creatorName?: string;
  creatorProfile?: UserProfile;
  chainName: string;
  chainLogoUrl: string;
  chain: Chain;
  raffleId: string;
  isClaimable: boolean;
  isExpired: boolean;
  userEntry: UserEntryInRaffle;
  numberOfEntries: number;
  numberOfOnchainEntries: number;
  maxNumberOfEntries: number;
  prizeAmount: number;
  prizeName: string;
  prizeSymbol: string;
  winnerEntry: WinnerEntry;
  winnerEntries: WinnerEntry[];
  startAt: string;
  maxMultiplier: number;
  prizeAsset?: string;
  status: "PENDING" | "REJECTED" | string;
  winnersCount: number;
  isPreEnrollment: boolean;
};

export type WinnerEntry = {
  claimingPrizeTx: Address | null;
  createdAt: string;
  multiplier: number;
  pk: number;
  raffle: userRaffle;
  txHash: string;
  userProfile: UserProfile;
  userWalletAddress: Address;
};

export type EnrollPayload = {
  raffleId: number;
  nonce: number;
  signature: string;
  method: string;
};

export type EnrollmentRaffleApi = {
  detail: string;
  signature: UserEntryInRaffle;
};

export type EnrollmentSignature = {
  result: muonResult;
};

type muonResult = {
  data: muonInit;
  reqId: string;
  signatures: muonSignature[];
  shieldSignature: string;
};

type muonInit = {
  init: { nonceAddress: string };
};

type muonSignature = {
  owner: string;
  signature: string;
};

export type UserEntryInRaffle = {
  claimingPrizeTx: null | string;
  createdAt: string;
  multiplier: number;
  pk: number;
  raffle: userRaffle;
  txHash: string | null;
  userProfile: UserProfile;
  wallet: string;
};

type userRaffle = {
  contract: string;
  name: string;
  pk: number;
  raffleId: number;
};
