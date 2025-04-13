export enum EffectType {
  Point = "point",
  Badge = "badge",
  FCFS = "fcsfs",
  DiscordRole = "discordRule",
  Raffle = "raffle",
  FortuneWheel = "fortuneWheel",
  PointMultiplier = "pointMultiplier",
  Jackpot = "jackpot",
}

export interface Effect {
  type: EffectType;
  params: unknown;
  effectName: string;
  logo?: string;
  thirdpartyapp: string;
}

export interface EffectFormBuilder {
  required?: boolean;
  label?: string;
  type?: "number" | "text" | "file";
}

export interface EffectMethod {
  name: string;
  params: Record<string, EffectFormBuilder>;
  label?: string;
}

export interface AppEffect {
  label: string;
  logo: string;
  children: EffectMethod[];
}
export const effectTypeApps: Record<EffectType, AppEffect> = {
  [EffectType.Point]: {
    label: "Point",
    logo: "/assets/images/thirdparties/star.svg",
    children: [
      {
        name: "point-star",
        label: "Star",
        params: {
          amount: {
            label: "Amount",
            type: "number",
            required: true,
          },
        },
      },
      {
        name: "point-point",
        label: "Point",
        params: {
          amount: {
            label: "Amount",
            type: "number",
            required: true,
          },
        },
      },
    ],
  },
  [EffectType.Badge]: {
    label: "Badge",
    logo: "/assets/images/thirdparties/badge.svg",
    children: [
      {
        name: "badge-medal",
        label: "Badge Medal",
        params: {},
      },
      {
        name: "badge-medal-2",
        label: "Badge Medal 2",
        params: {},
      },
      {
        name: "level-8",
        label: "Level 8",
        params: {},
      },
    ],
  },
  [EffectType.DiscordRole]: {
    label: "Discord Role",
    logo: "/assets/images/thirdparties/discord.svg",
    children: [],
  },
  [EffectType.FCFS]: {
    label: "FCFS",
    logo: "/assets/images/thirdparties/fcfs.svg",
    children: [],
  },
  [EffectType.Raffle]: {
    label: "Raffle",
    logo: "/assets/images/thirdparties/raffle.svg",
    children: [],
  },
  [EffectType.FortuneWheel]: {
    label: "Fortune Wheel",
    logo: "/assets/images/thirdparties/fortune-wheel.svg",
    children: [],
  },
  [EffectType.Jackpot]: {
    label: "Jackpot",
    logo: "/assets/images/thirdparties/jackpot.svg",
    children: [],
  },
  [EffectType.PointMultiplier]: {
    label: "Point Multiplier",
    logo: "/assets/images/thirdparties/point-multiplier.svg",
    children: [
      {
        name: "point-star",
        label: "Star",
        params: {
          multiplies: {
            label: "Multiplies",
            type: "number",
            required: true,
          },
        },
      },
      {
        name: "point-point",
        label: "Point",
        params: {
          multiplies: {
            label: "Multiplies",
            type: "number",
            required: true,
          },
        },
      },
    ],
  },
};
