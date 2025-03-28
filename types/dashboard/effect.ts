

export enum EffectType {
  Point,
  Badge,
  FCFS,
  DiscordRole,
  Raffle,
  FortuneWheel,
  PointMultiplier
}

export interface Effect {
  type: EffectType
  params: never
  effectName: string
}