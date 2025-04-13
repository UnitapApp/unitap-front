import { Condition } from "./condition";
import { Effect } from "./effect";

export enum RuleType {
  OneTime = "OneTime",
  Periodic = "Periodic",
}

export interface Rule {
  name: string;
  isEventRule: boolean;
  type: RuleType;
  startTime: Date;
  expireTime: Date;
  limitOfUsage: number;
  conditions: Condition[];
  effects: Effect[];
}
