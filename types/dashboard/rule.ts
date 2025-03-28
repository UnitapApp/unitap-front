import { Condition } from "./condition"
import { Effect } from "./effect"


export enum RuleType {
  OneTime,
  Periodic
}

export interface Rule {
  isEventRule: boolean
  type: RuleType
  startAt: Date
  endAt: Date
  limitOfUsage: number
  conditions: Condition[]
  effects: Effect[]
}

