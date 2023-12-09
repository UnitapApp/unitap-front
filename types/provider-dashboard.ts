import { UserProfile } from "./auth";
import { Chain } from "./gas-tap";

export type ProviderDashboardFormDataProp = {
  provider: string | null;
  description: string | null;
  isNft: boolean;
  isNativeToken: boolean;
  tokenAmount: string;
  tokenContractAddress: string;
  nftContractAddress: string;
  nftTokenIds: string[];
  selectedChain: any | null;
  startTimeStamp: any;
  endTimeStamp: any;
  limitEnrollPeopleCheck: boolean;
  maxNumberOfEntries: string | null;
  email: string | null;
  twitter: string | null;
  discord: string | null;
  telegram: string | null;
  creatorUrl: string | null;
  necessaryInfo: string | null;
  satisfy: string;
  allowListPrivate: boolean;
  setDuration: boolean;
  numberOfDuration: number;
  durationUnitTime: string;
  NftSatisfy: boolean;
  decimal: number | null;
  tokenName: string | null;
  tokenSymbol: string | null;
  tokenDecimals: any;
  userTokenBalance: string | undefined;
  nftName: string | null;
  nftSymbol: string | null;
  userNftBalance: string | undefined;
  nftTokenUri: string | null;
  winnersCount: number;
  totalAmount: string;
};

export type ErrorProps = {
  startDateStatus: null | boolean;
  statDateStatusMessage: null | string;
  endDateStatus: null | boolean;
  endDateStatusMessage: null | string;
  numberOfDurationStatus: null | boolean;
  numberOfDurationMessage: null | string;
  maximumLimitationStatus: null | boolean;
  maximumLimitationMessage: null | string;
  numberOfWinnersStatus: boolean;
  numberOfWinnersMessage: null | string;
};

export interface ConstraintParams {
  id: number;
}

export interface ConstraintProps {
  description: string | null;
  name: string;
  params: ConstraintParams[];
  pk: number;
  response: string | null;
  title: string;
  type: string;
  iconUrl: string | null;
}

export interface ConstraintParamValues {
  name: string;
  pk: number;
  values: Record<number, string | number | boolean> | null;
  title: string;
  isNotSatisfy: boolean
}

export interface UserRafflesProps {
  chain: Chain;
  constraintParams: ConstraintProps;
  constraints:  ConstraintParamValues[];
  contract: string;
  createdAt: string;
  creatorAddress: string;
  creatorName: string;
  creatorProfile: UserProfile;
  creatorUrl: string | null;
  deadline: string;
  decimals: number;
  description: string;
  discordUrl: string;
  imageUrl: string;
  isActive: boolean;
  isClaimable: boolean;
  isExpired: boolean;
  isPrizeNft: boolean;
  maxMultiplier: number;
  maxNumberOfEntries: number;
  name: string;
  nftIds: string | null;
  numberOfEntries: number;
  numberOfOnchainEntries: number;
  pk: number;
  prizeAmount: number;
  prizeAsset: string;
  prizeName: string;
  prizeSymbol: string;
  raffleId: string | null;
  rejectionReason: string | null;
  reversedConstraints: string | null;
  startAt: string;
  status: string;
  tokenUri: string | null;
  twitterUrl: string | null;
  telegramUrl: string | null;
  emailUrl: string | null;
  txHash: string | null;
  userEntry: string | null;
  winnerEntry: string | null;
  winnersCount: number;
  necessaryInformation: string | null;
}

export interface NftStatusProp {
  nftId: string;
  isOwner: boolean;
}

type userRaffle = {
  contract: string;
  name: string;
  pk: number;
  raffleId: number;
};

export type ProviderFormPaginationProp = {
  handleChangeFormPagePrev: () => void;
  handleChangeFormPageNext: () => void;
};

export type ErrorObjectProp = {
  startDateStatus: null | boolean;
  statDateStatusMessage: null | string;
  endDateStatus: null | boolean;
  endDateStatusMessage: null | string;
  numberOfDurationStatus: null | boolean;
  numberOfDurationMessage: null | string;
  maximumLimitationStatus: null | boolean;
  maximumLimitationMessage: any;
  numberOfWinnersStatus: boolean;
  numberOfWinnersMessage: null | string;
};

export interface ContractStatus {
  checking: boolean;
  isValid: boolean;
  canDisplayStatus: boolean;
}