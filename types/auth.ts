import { PK } from "."

type UserWallet = {
  walletType: string
  pk: number
  address: string
}

export type UserProfile = {
  isMeetVerified: boolean
  isAuraVerified: boolean
  initial_context_id: string
  token: string
  pk: PK
  wallets: UserWallet[]
  username: string
}

export type Settings = {
  gastapRoundClaimLimit: number
  tokentapRoundClaimLimit: number
  prizetapRoundClaimLimit: number
  isGasTapAvailable: boolean
}

export enum BrightIdModalState {
  CLOSED = "0",
  OPENED = "1",
  NOT_CONNECTED = "2",
  CONNECTED_NOT_VERIFIED = "3",
  CONNECTED_AND_VERIFIED = "4",
}

export type Permission = {
  id: PK
  name: string
  description: string
  resourcetype: string
  type: "TIME" | "VER"
  title?: string
}

export enum PermissionType {
  BRIGHTID = "BrightID Meet Verification",
  AURA = "Aura",
}
