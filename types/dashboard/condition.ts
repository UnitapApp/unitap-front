export enum ConditionType {
  Verification = "verification",
  SocialMedia = "socialMedia",
  OnChain = "onChain",
  OffChain = "offChain",
  Unitap = "unitap",
  WhiteList = "whiteList",
}

export interface Condition {
  type: ConditionType;
  thirdpartyapp: string;
  constraintName: string;
  params: unknown;
  logo?: string;
}

export interface ConditionFormBuilder {
  required?: boolean;
  label?: string;
  type?: "number" | "text" | "file";
}

export interface ConditionMethod {
  name: string;
  params: Record<string, ConditionFormBuilder>;
  label?: string;
}

export interface AppCondition {
  label: string;
  logo: string;
  children: ConditionMethod[];
}

export const ConditionTypeApps: Record<ConditionType, AppCondition[]> = {
  [ConditionType.Verification]: [
    {
      label: "BrightID",
      logo: "/assets/images/up-profile/brightid.svg",
      children: [
        {
          name: "meetVerified",
          params: {},
          label: "Meet Verified",
        },
        {
          name: "auraVerified",
          params: {},
          label: "Aura Verified",
        },
      ],
    },
    {
      label: "Captcha",
      logo: "/assets/images/thirdparties/captcha.svg",
      children: [
        {
          name: "cloudflareCaptcha",
          params: {},
          label: "Cloudflare Captcha",
        },
        {
          name: "hcaptcha",
          params: {},
          label: "HCaptcha",
        },
      ],
    },
    {
      label: "Gitcoin Passport",
      logo: "/assets/images/up-profile/gitcoin-passport.svg",
      children: [
        {
          name: "scoreMoreThan",
          params: {
            score: {
              type: "number",
              required: true,
            },
          },
          label: "Score More Than",
        },
        {
          name: "scoreLessThan",
          params: {
            score: {
              type: "number",
              required: true,
            },
          },
          label: "Score Less Than",
        },
      ],
    },
    {
      label: "ENS",
      logo: "/assets/images/ens.svg",
      children: [
        {
          name: "hasENS",
          params: {},
          label: "Has ENS",
        },
      ],
    },
    {
      label: "Lens",
      logo: "/assets/images/thirdparties/lens.svg",
      children: [
        {
          name: "hasLens",
          params: {},
          label: "Has Lens",
        },
      ],
    },
    {
      label: "Google Account",
      logo: "/assets/images/google.svg",
      children: [
        {
          name: "hasGoogleAccount",
          params: {},
          label: "Has Google Account",
        },
      ],
    },
    {
      label: "Apple ID",
      logo: "/assets/images/apple.svg",
      children: [
        {
          name: "hasAppleID",
          params: {},
          label: "Has Apple ID Account",
        },
      ],
    },
  ],
  [ConditionType.SocialMedia]: [
    {
      label: "X(Twitter)",
      logo: "/assets/images/thirdparties/x.svg",
      children: [
        {
          name: "connectAccount",
          params: {},
          label: "Connect Account",
        },
        {
          name: "follow",
          params: {
            usename: {
              type: "text",
              required: true,
              label: "Username or id",
            },
          },
          label: "Follow",
        },
        {
          name: "like",
          params: {
            post: {
              type: "text",
              required: true,
              label: "Post link or id",
            },
          },
          label: "Like",
        },
        {
          name: "retweet",
          params: {
            post: {
              type: "text",
              required: true,
              label: "Post link or id",
            },
          },
          label: "Retweet",
        },
        {
          name: "Quote",
          params: {
            post: {
              type: "text",
              required: true,
              label: "Post link or id",
            },
          },
          label: "Quote",
        },
      ],
    },
    {
      label: "Discord",
      logo: "/assets/images/thirdparties/discord.svg",
      children: [
        {
          name: "connectAccount",
          params: {},
          label: "Connect Account",
        },
        {
          name: "joinServer",
          params: {
            server: {
              type: "text",
              required: true,
              label: "Server link or id",
            },
          },
          label: "Join Server",
        },
      ],
    },
    {
      label: "Telegram",
      logo: "/assets/images/thirdparties/telegram.svg",
      children: [
        {
          name: "connectAccount",
          params: {},
          label: "Connect Account",
        },
        {
          name: "joinChannel",
          params: {
            channel: {
              type: "text",
              required: true,
              label: "Channel id or link",
            },
          },
          label: "Join Channel",
        },
        {
          name: "isPremium",
          params: {},
          label: "Is Premium",
        },
      ],
    },
    {
      label: "Farcaster",
      logo: "/assets/images/thirdparties/farcaster.svg",
      children: [
        {
          name: "connectAccount",
          params: {},
          label: "Connect Account",
        },
        {
          name: "follow",
          params: {
            usename: {
              type: "text",
              required: true,
              label: "Username or id",
            },
          },
          label: "Follow",
        },
      ],
    },
    {
      label: "Instagram",
      logo: "/assets/images/thirdparties/instagram.svg",
      children: [
        {
          name: "connectAccount",
          params: {},
          label: "Connect Account",
        },
        {
          name: "follow",
          params: {
            post: {
              type: "text",
              required: true,
              label: "Username or id",
            },
          },
          label: "Follow",
        },
        {
          name: "like",
          params: {
            post: {
              type: "text",
              required: true,
              label: "Post link or id",
            },
          },
          label: "Like",
        },
      ],
    },
    {
      label: "Lens",
      logo: "/assets/images/thirdparties/lens.svg",
      children: [
        {
          name: "connectAccount",
          params: {},
          label: "Connect Account",
        },
        {
          name: "follow",
          params: {
            usename: {
              type: "text",
              required: true,
              label: "Username or id",
            },
          },
          label: "Follow",
        },
        {
          name: "like",
          params: {
            post: {
              type: "text",
              required: true,
              label: "Post link or id",
            },
          },
          label: "Like",
        },
        {
          name: "repost",
          params: {
            post: {
              type: "text",
              required: true,
              label: "Post link or id",
            },
          },
          label: "Repost",
        },
      ],
    },
  ],
  [ConditionType.OnChain]: [
    {
      label: "Transaction",
      logo: "/assets/images/thirdparties/transaction.svg",
      children: [
        {
          name: "swap",
          params: {
            chaindId: {
              type: "text",
              required: true,
              label: "Chain ID",
            },
            token: {
              type: "text",
              required: true,
              label: "Token address",
            },
            amount: {
              type: "number",
              required: true,
              label: "Token Amount",
            },
          },
          label: "Swap",
        },
        {
          name: "bridge",
          params: {
            chaindId: {
              type: "text",
              required: true,
              label: "Chain ID",
            },
            token: {
              type: "text",
              required: true,
              label: "Token address",
            },
            amount: {
              type: "number",
              required: true,
              label: "Token Amount",
            },
          },
          label: "Bridge",
        },
        {
          name: "transfer",
          params: {
            chaindId: {
              type: "text",
              required: true,
              label: "Chain ID",
            },
            token: {
              type: "text",
              required: true,
              label: "Token address",
            },
            amount: {
              type: "number",
              required: true,
              label: "Token Amount",
            },
            to: {
              type: "text",
              required: true,
              label: "To Address",
            },
          },
          label: "Transfer",
        },
        {
          name: "deligate",
          params: {
            chaindId: {
              type: "text",
              required: true,
              label: "Chain ID",
            },
            token: {
              type: "text",
              required: true,
              label: "Token address",
            },
            amount: {
              type: "number",
              required: true,
              label: "Token Amount",
            },
          },
          label: "Deligation",
        },
        {
          name: "staking",
          params: {
            chaindId: {
              type: "text",
              required: true,
              label: "Chain ID",
            },
            token: {
              type: "text",
              required: true,
              label: "Token address",
            },
            amount: {
              type: "number",
              required: true,
              label: "Token Amount",
            },
          },
          label: "Staking",
        },
      ],
    },
    {
      label: "Own Assets",
      logo: "/assets/images/thirdparties/owns-assets.svg",
      children: [
        {
          name: "nft",
          params: {
            chaindId: {
              type: "text",
              required: true,
              label: "Chain ID",
            },
            token: {
              type: "text",
              required: true,
              label: "Token address",
            },
            amount: {
              type: "number",
              required: true,
              label: "Token Amount",
            },
          },
          label: "NFT",
        },
        {
          name: "token",
          params: {
            chaindId: {
              type: "text",
              required: true,
              label: "Chain ID",
            },
            token: {
              type: "text",
              required: true,
              label: "Token address",
            },
            amount: {
              type: "number",
              required: true,
              label: "Token Amount",
            },
          },
          label: "Token",
        },
      ],
    },
  ],
  [ConditionType.OffChain]: [
    {
      label: "Choose An Activity",
      logo: "/assets/images/thirdparties/activity.svg",
      children: [
        {
          name: "buy",
          params: {},
          label: "Buy 5$",
        },
        {
          name: "login",
          params: {},
          label: "Login To The App",
        },
        {
          name: "addCommentInApp",
          params: {},
          label: "Add Comment In My App",
        },
      ],
    },
  ],
  [ConditionType.Unitap]: [
    {
      label: "Point",
      logo: "/assets/images/thirdparties/point.svg",
      children: [
        {
          name: "amount",
          params: {
            amount: {
              type: "number",
              required: true,
              label: "Point Amount",
            },
          },
          label: "Amount",
        },
        {
          name: "rank",
          params: {
            rank: {
              type: "number",
              required: true,
              label: "Rank",
            },
          },
          label: "Ranking",
        },
      ],
    },
    {
      label: "Badge",
      logo: "/assets/images/thirdparties/badge.svg",
      children: [
        {
          name: "toHave",
          params: {
            badgeId: {
              type: "number",
              required: true,
              label: "Badge ID",
            },
          },
          label: "To Have",
        },
        {
          name: "toNotHave",
          params: {
            badgeId: {
              type: "number",
              required: true,
              label: "Badge ID",
            },
          },
          label: "To Not Have",
        },
      ],
    },
  ],
  [ConditionType.WhiteList]: [
    {
      label: "Upload File",
      logo: "/assets/images/provider-dashboard/upload.svg",
      children: [
        {
          name: "Upload File",
          params: {
            amount: {
              type: "file",
              required: true,
              label: "Upload File",
            },
          },
          label: "White List",
        },
      ],
    },
  ],
};
