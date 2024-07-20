import { UserProfile } from "./auth";
import { Chain, Faucet } from "./gastap";
import { WinnerEntry } from "./prizetap";

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
  maxNumberOfEntries: string | null;
  email: string | null;
  twitter: string | null;
  discord: string | null;
  telegram: string | null;
  creatorUrl: string | null;
  necessaryInfo: string | null;
  satisfy: string;
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

export interface ConstraintProps {
  description: string | null;
  explanation: string | null;
  iconUrl: string | null;
  name: string;
  negativeDescription: string;
  params: any;
  pk: number;
  response: string | null;
  title: string;
  type: string;
}

export interface RequirementProps {
  name: string;
  pk: number;
  params: any;
  title: string;
  isNotSatisfy: boolean;
  isReversed: boolean;
  constraintFile?: [];
  decimals: number | undefined;
}

export interface UserRafflesProps {
  chain: Chain;
  constraintParams: ConstraintProps;
  constraints: RequirementProps[];
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
  winnerEntries: WinnerEntry[] | null;
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

export enum ContractValidationStatus {
  Valid,
  NotValid,
  Empty,
}

export interface ContractStatus {
  checking: boolean;
  isValid: ContractValidationStatus;
  canDisplayStatus: boolean;
}

export interface DisplayStepsProps {
  id: number;
  prevIcon: string;
  activeIcon: string;
  nextIcon: string;
  title: string;
  description: string;
}

export interface NftRangeProps {
  from: string;
  to: string;
}

export interface EnrollmentDurationsProps {
  id: number;
  name: string;
  selected: boolean;
  time: string | null;
  value: number;
  status: string;
}

export interface UploadedFileProps {
  fileName: string;
  fileContent: any;
}

export interface ContactField {
  name: keyof ProviderDashboardFormDataProp;
  placeholder: string;
  icon: string;
  required: boolean;
  baseUrl: string;
}

export interface UserTokenDistribution {
  id: number;
  amount: string;
  chain: Chain;
  constraints: RequirementProps[];
  contract: string;
  createdAt: string;
  deadline: string;
  discordUrl: string;
  distributor: string;
  distributorUrl: string;
  emailUrl: string;
  imageUrl: string;
  isActive: boolean;
  isClaimable: boolean;
  isExpired: boolean;
  isMaxedOut: boolean;
  maxNumberOfClaims: number;
  name: string;
  necessaryInformation: string | null;
  notes: string;
  numberOfClaims: number;
  numberOfOnchainClaims: number;
  rejectionReason: string | null;
  startAt: string;
  status: string;
  telegramUrl: string | null;
  token: string;
  tokenAddress: string;
  tokenImageUrl: string;
  totalClaimsSinceLastRound: number;
  twitterUrl: string | null;
  decimals: number;
  isOneTimeClaim: boolean;
}

export interface UserDonation {
  datetime: string;
  faucet: Faucet;
  status: string;
  totalPrice: null;
  txHash: string;
  userProfile: UserProfile;
  value: string;
}

export enum MainnetFilters {
  All = "All",
  Mainnet = "Mainnet",
  Testnet = "Testnet",
}

export enum EvmFilters {
  All = "All",
  Evm = "EVM",
  NonEvm = "NonEvm",
}

export enum StatusFilters {
  All = "All",
  Pending = "Pending",
  Verified = "Verified",
  Rejected = "Rejected",
}

export interface filterProps {
  statusFilter: StatusFilters;
  mainnetFilter: MainnetFilters;
  evmFilter: EvmFilters;
}

export type TokenOnChain = {
  tokenAddress: string;
  tokenDecimals: string;
  tokenName: string;
  tokenSymbol: string;
  logoUrl: string;
  balance?: string;
};

export type TokenBalance = {
  [tokenAddress: string]: string;
};
export interface TokenInformation {
  chainId: string;
  chainName: string;
  tokenList: TokenOnChain[];
}
