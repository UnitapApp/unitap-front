

export enum ConditionType {
  Verification,
  SocialMedia,
  OnChain,
  OffChain,
  WhiteList
}

export interface Condition {
  type: ConditionType
  thirdpartyapp: string
  constraintName: string
  params: never
}