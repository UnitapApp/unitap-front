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
  gasImageUrl: string;
  totalClaimsSinceLastMonday: number;
  isTestnet: boolean;
  chainType: string;
  needsFunding: boolean;
  blockScanAddress: string;
};

export type Prize = {
  pk: PK;
  imageUrl: string;
  background: string;
  creator: string;
  enrolled: number;
  source: string;
  twitterUrl: string;
  discordUrl: string;
  description: string;
  createdAt: string;
  deadline: string;
};

export enum BrightIdVerificationStatus {
  PENDING = '0',
  VERIFIED = '1',
}

type UserWallet = {
  walletType: string;
  pk: number;
  address: string;
}

export type UserProfile = {
  isMeetVerified: string;
  isAuraVerified: string;
  initial_context_id: string;
  token: string;
  pk: PK;
  wallets: UserWallet[];
};

export enum ClaimReceiptState {
  PENDING = 'Pending',
  VERIFIED = 'Verified',
  REJECTED = 'Rejected',
}

export enum ClaimBoxState {
  CLOSED = '-5',
  WALLET_NOT_CONNECTED = '-4',
  BRIGHTID_NOT_VERIFIED = '-3',
  BRIGHTID_NOT_CONNECTED = '-6',
  INITIAL = '-2',
  REQUEST = '-1',
  PENDING = '0',
  VERIFIED = '1',
  REJECTED = '2',
}

export type ClaimReceipt = {
  pk: PK;
  txHash: string | null;
  chain: Chain;
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

export enum ClaimNonEVMModalState {
  CLOSED = '0',
  OPENED = '1',
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
  ALL = '2',
}

export enum ChainType {
  EVM = 'EVM',
  NONEVM = 'NONEVM',
  SOLANA = 'Solana',
  LIGHTNING = 'Lightning',
  ALL = 'ALL',
}

export enum APIErrorsSource {
  TEST = 'TEST',
  BRIGHTID_CONNECTION_ERROR = 'BRIGHTID_CONNECTION_ERROR',
}

export type APIError = {
  message: string;
  source: APIErrorsSource;
  statusCode: number;
}
