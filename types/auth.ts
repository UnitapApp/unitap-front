import { Address } from "viem";
import { PK } from ".";

type UserWallet = {
  walletType: string;
  pk: number;
  address: Address;
};

export type UserProfile = {
  isMeetVerified: boolean;
  isAuraVerified: boolean;
  initial_context_id: string;
  token: string;
  pk: PK;
  wallets: UserWallet[];
  username: string;
  prizetapWinningChanceNumber: number;
  upBalance: number;
};

export type Settings = {
  gastapRoundClaimLimit: number;
  tokentapRoundClaimLimit: number;
  prizetapRoundClaimLimit: number;
  isGasTapAvailable: boolean;
};

export enum BrightIdModalState {
  CLOSED = "0",
  OPENED = "1",
  NOT_CONNECTED = "2",
  CONNECTED_NOT_VERIFIED = "3",
  CONNECTED_AND_VERIFIED = "4",
}

export type UserConnection = {
  [key: string]: {
    id: number;
    userProfile: UserProfile;
    createdAt: string;
    isConnected: boolean;
  };
};

export type Permission = {
  isReversed: boolean;
  id: PK;
  pk: PK;
  name: string;
  description: string;
  resourcetype: string;
  type: "TIME" | "VER";
  title?: string;
  negativeDescription: string | null;
};

export enum PermissionType {
  BRIGHTID = "BrightID Meet Verification",
  AURA = "Aura",
}
