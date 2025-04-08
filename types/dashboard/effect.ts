export enum EffectType {
  Point = "point",
  Badge = "badge",
  FCFS = "fcsfs",
  DiscordRole = "discordRule",
  Raffle = "raffle",
  FortuneWheel = "fortuneWheel",
  PointMultiplier = "pointMultiplier",
}

export interface Effect {
  type: EffectType;
  params: never;
  effectName: string;
}
