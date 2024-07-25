import { Ether, NativeCurrency, Token, WETH9 } from "@uniswap/sdk-core";

import { SupportedChainId } from "./chains";
import { TokenInformation } from "@/types";

export const USDC_MAINNET = new Token(
  SupportedChainId.MAINNET,
  "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
  6,
  "USDC",
  "USDC",
);
export const AMPL = new Token(
  SupportedChainId.MAINNET,
  "0xD46bA6D942050d489DBd938a2C909A5d5039A161",
  9,
  "AMPL",
  "Ampleforth",
);
export const DAI = new Token(
  SupportedChainId.MAINNET,
  "0x6B175474E89094C44Da98b954EedeAC495271d0F",
  18,
  "DAI",
  "Dai Stablecoin",
);

export const USDT = new Token(
  SupportedChainId.MAINNET,
  "0xdAC17F958D2ee523a2206206994597C13D831ec7",
  6,
  "USDT",
  "Tether USD",
);
export const WBTC = new Token(
  SupportedChainId.MAINNET,
  "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599",
  8,
  "WBTC",
  "Wrapped BTC",
);
export const FEI = new Token(
  SupportedChainId.MAINNET,
  "0x956F47F50A910163D8BF957Cf5846D573E7f87CA",
  18,
  "FEI",
  "Fei USD",
);
export const TRIBE = new Token(
  SupportedChainId.MAINNET,
  "0xc7283b66Eb1EB5FB86327f08e1B5816b0720212B",
  18,
  "TRIBE",
  "Tribe",
);
export const FRAX = new Token(
  SupportedChainId.MAINNET,
  "0x853d955aCEf822Db058eb8505911ED77F175b99e",
  18,
  "FRAX",
  "Frax",
);
export const FXS = new Token(
  SupportedChainId.MAINNET,
  "0x3432B6A60D23Ca0dFCa7761B7ab56459D9C964D0",
  18,
  "FXS",
  "Frax Share",
);
export const renBTC = new Token(
  SupportedChainId.MAINNET,
  "0xEB4C2781e4ebA804CE9a9803C67d0893436bB27D",
  8,
  "renBTC",
  "renBTC",
);
export const ETH2X_FLI = new Token(
  SupportedChainId.MAINNET,
  "0xAa6E8127831c9DE45ae56bB1b0d4D4Da6e5665BD",
  18,
  "ETH2x-FLI",
  "ETH 2x Flexible Leverage Index",
);
export const sETH2 = new Token(
  SupportedChainId.MAINNET,
  "0xFe2e637202056d30016725477c5da089Ab0A043A",
  18,
  "sETH2",
  "StakeWise Staked ETH2",
);
export const rETH2 = new Token(
  SupportedChainId.MAINNET,
  "0x20BC832ca081b91433ff6c17f85701B6e92486c5",
  18,
  "rETH2",
  "StakeWise Reward ETH2",
);
export const SWISE = new Token(
  SupportedChainId.MAINNET,
  "0x48C3399719B582dD63eB5AADf12A40B4C3f52FA2",
  18,
  "SWISE",
  "StakeWise",
);

export const WRAPPED_NATIVE_CURRENCY: { [chainId: number]: Token | undefined } =
  {
    ...(WETH9 as Record<SupportedChainId, Token>),
  };

export class ExtendedEther extends Ether {
  private static _cachedExtendedEther: { [chainId: number]: NativeCurrency } =
    {};

  public get wrapped(): Token {
    const wrapped = WRAPPED_NATIVE_CURRENCY[this.chainId];
    if (wrapped) return wrapped;
    throw new Error("Unsupported chain ID");
  }

  public static onChain(chainId: number): ExtendedEther {
    return (
      this._cachedExtendedEther[chainId] ??
      (this._cachedExtendedEther[chainId] = new ExtendedEther(chainId))
    );
  }
}

const cachedNativeCurrency: { [chainId: number]: NativeCurrency | Token } = {};

export function nativeOnChain(chainId: number): NativeCurrency | Token {
  if (cachedNativeCurrency[chainId]) return cachedNativeCurrency[chainId];
  const nativeCurrency: NativeCurrency | Token = ExtendedEther.onChain(chainId);
  // if (isMatic(chainId)) {
  //     nativeCurrency = new MaticNativeCurrency(chainId);
  // } else if (isCelo(chainId)) {
  //   nativeCurrency = getCeloNativeCurrency(chainId)
  // } else {
  //   nativeCurrency = ExtendedEther.onChain(chainId)
  // }
  return (cachedNativeCurrency[chainId] = nativeCurrency);
}

export const TOKEN_SHORTHANDS: {
  [shorthand: string]: { [chainId in SupportedChainId]?: string };
} = {
  USDC: {
    [SupportedChainId.MAINNET]: USDC_MAINNET.address,
  },
};

export const BrightToken = {
  tokenAddress: "0x83FF60E2f93F8eDD0637Ef669C69D5Fb4f64cA8E",
  tokenSymbol: "xDai",
  tokenName: "Bright",
  tokenDecimals: "18",
  image:
    "https://bafybeibgnxyn4r6cbydndtlem3jimpme3hdie25qcqmqsucmsmakc5xoem.ipfs.w3s.link/ipfs/bafkreigqbkaqejtgayiq5kxsimbwjdadoxeqhhmacanihaniz5mapjysuu?filename=bright%20token%20(1).svg",
};

export const metaMaskTokenConfigs: { [key: string]: any } = {
  Bright: BrightToken,
};

export const tokensInformation: TokenInformation[] = [
  {
    chainId: "42161",
    chainName: "arbitrum",
    tokenList: [
      {
        tokenAddress: "0x0000000000000000000000000000000000000000",
        tokenDecimals: "18",
        tokenName: "ETH",
        tokenSymbol: "ETH",
        logoUrl:
          "https://imagedelivery.net/XQ6LDks1pWNDtTDAw7o9nA/cf2db6ea-299f-4934-360a-a928aa231700/public",
      },
      {
        tokenAddress: "0x82aF49447D8a07e3bd95BD0d56f35241523fBab1",
        tokenSymbol: "WETH",
        tokenName: "Wrapped Ether",
        tokenDecimals: "18",

        logoUrl:
          "https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2/logo.png",
      },
      {
        tokenAddress: "0xaf88d065e77c8cC2239327C5EDb3A432268e5831",
        tokenSymbol: "USDC",
        tokenName: "USD Coin",
        tokenDecimals: "6",

        logoUrl:
          "https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png",
      },
      {
        tokenAddress: "0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9",
        tokenSymbol: "USDT",
        tokenName: "Tether USD",
        tokenDecimals: "6",

        logoUrl:
          "https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0xdAC17F958D2ee523a2206206994597C13D831ec7/logo.png",
      },
      {
        tokenAddress: "0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8",
        tokenSymbol: "USDC.e",
        tokenName: "Bridged USDC",
        tokenDecimals: "6",

        logoUrl:
          "https://assets.coingecko.com/coins/images/30691/large/usdc.png?1696529560",
      },
      {
        tokenAddress: "0x2f2a2543B76A4166549F7aaB2e75Bef0aefC5B0f",
        tokenSymbol: "WBTC",
        tokenName: "Wrapped BTC",
        tokenDecimals: "8",

        logoUrl:
          "https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599/logo.png",
      },
      {
        tokenAddress: "0x912CE59144191C1204E64559FE8253a0e49E6548",
        tokenSymbol: "ARB",
        tokenName: "Arbitrum",
        tokenDecimals: "18",

        logoUrl:
          "https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0xB50721BCf8d664c30412Cfbc6cf7a15145234ad1/logo.png",
      },
      {
        tokenAddress: "0xfc5A1A6EB076a2C7aD06eD22C90d7E710E35ad0a",
        tokenSymbol: "GMX",
        tokenName: "GMX",
        tokenDecimals: "18",

        logoUrl:
          "https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/arbitrum/assets/0xfc5A1A6EB076a2C7aD06eD22C90d7E710E35ad0a/logo.png",
      },
      {
        tokenAddress: "0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1",
        tokenSymbol: "DAI",
        tokenName: "Dai Stablecoin",
        tokenDecimals: "18",

        logoUrl:
          "https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0x6B175474E89094C44Da98b954EedeAC495271d0F/logo.png",
      },
      {
        tokenAddress: "0x9623063377AD1B27544C965cCd7342f7EA7e88C7",
        tokenSymbol: "GRT",
        tokenName: "The Graph",
        tokenDecimals: "18",

        logoUrl:
          "https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0xc944E90C64B2c07662A292be6244BDf05Cda44a7/logo.png",
      },
      {
        tokenAddress: "0xf97f4df75117a78c1A5a0DBb814Af92458539FB4",
        tokenSymbol: "LINK",
        tokenName: "ChainLink Token",
        tokenDecimals: "18",

        logoUrl:
          "https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0x514910771AF9Ca656af840dff83E8264EcF986CA/logo.png",
      },
      {
        tokenAddress: "0x289ba1701C2F088cf0faf8B3705246331cB8A839",
        tokenSymbol: "LPT",
        tokenName: "Livepeer",
        tokenDecimals: "18",

        logoUrl:
          "https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0x58b6A8A3302369DAEc383334672404Ee733aB239/logo.png",
      },
      {
        tokenAddress: "0x11cDb42B0EB46D95f990BeDD4695A6e3fA034978",
        tokenSymbol: "CRV",
        tokenName: "Curve DAO Token",
        tokenDecimals: "18",

        logoUrl:
          "https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0xD533a949740bb3306d119CC777fa900bA034cd52/logo.png",
      },
      {
        tokenAddress: "0xFa7F8980b0f1E64A2062791cc3b0871572f1F7f0",
        tokenSymbol: "UNI",
        tokenName: "Uniswap",
        tokenDecimals: "18",

        logoUrl:
          "https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984/logo.png",
      },
      {
        tokenAddress: "0x6694340fc020c5E6B96567843da2df01b2CE1eb6",
        tokenSymbol: "STG",
        tokenName: "Stargate Finance",
        tokenDecimals: "18",

        logoUrl:
          "https://assets.coingecko.com/coins/images/24413/large/STG_LOGO.png?1696523595",
      },
      {
        tokenAddress: "0xFA5Ed56A203466CbBC2430a43c66b9D8723528E7",
        tokenSymbol: "agEUR",
        tokenName: "agEur",
        tokenDecimals: "18",

        logoUrl:
          "https://assets.coingecko.com/coins/images/19479/large/agEUR-4.png?1710726218",
      },
      {
        tokenAddress: "0x25d887Ce7a35172C62FeBFD67a1856F20FaEbB00",
        tokenSymbol: "PEPE",
        tokenName: "Pepe",
        tokenDecimals: "18",

        logoUrl:
          "https://assets.coingecko.com/coins/images/29850/large/pepe-token.jpeg?1696528776",
      },
      {
        tokenAddress: "0x13Ad51ed4F1B7e9Dc168d8a00cB3f4dDD85EfA60",
        tokenSymbol: "LDO",
        tokenName: "Lido DAO",
        tokenDecimals: "18",

        logoUrl:
          "https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0x5A98FcBEA516Cf06857215779Fd812CA3beF1B32/logo.png",
      },
      {
        tokenAddress: "0x561877b6b3DD7651313794e5F2894B2F18bE0766",
        tokenSymbol: "MATIC",
        tokenName: "Polygon",
        tokenDecimals: "18",

        logoUrl:
          "https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0x7D1AfA7B718fb893dB30A3aBc0Cfc608AaCfeBB0/logo.png",
      },
      {
        tokenAddress: "0x1DEBd73E752bEaF79865Fd6446b0c970EaE7732f",
        tokenSymbol: "cbETH",
        tokenName: "Coinbase Wrapped Staked ETH",
        tokenDecimals: "18",

        logoUrl:
          "https://assets.coingecko.com/coins/images/27008/large/cbeth.png?1709186989",
      },
      {
        tokenAddress: "0xC8a4EeA31E9B6b61c406DF013DD4FEc76f21E279",
        tokenSymbol: "RNDR",
        tokenName: "Render Token",
        tokenDecimals: "18",

        logoUrl:
          "https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0x6De037ef9aD2725EB40118Bb1702EBb27e4Aeb24/logo.png",
      },
      {
        tokenAddress: "0x9d2F299715D94d8A7E6F5eaa8E654E8c74a988A7",
        tokenSymbol: "FXS",
        tokenName: "Frax Share",
        tokenDecimals: "18",

        logoUrl:
          "https://assets.coingecko.com/coins/images/13423/large/Frax_Shares_icon.png?1696513183",
      },
      {
        tokenAddress: "0x080F6AEd32Fc474DD5717105Dba5ea57268F46eb",
        tokenSymbol: "SYN",
        tokenName: "Synapse",
        tokenDecimals: "18",

        logoUrl:
          "https://assets.coingecko.com/coins/images/18024/large/synapse_social_icon.png?1696517540",
      },
      {
        tokenAddress: "0x4E51aC49bC5e2d87e0EF713E9e5AB2D71EF4F336",
        tokenSymbol: "CELO",
        tokenName: "Celo native asset (Wormhole)",
        tokenDecimals: "18",

        logoUrl:
          "https://assets.coingecko.com/coins/images/32400/large/celo_wh.png?1698055352",
      },
      {
        tokenAddress: "0xba5DdD1f9d7F570dc94a51479a000E3BCE967196",
        tokenSymbol: "AAVE",
        tokenName: "Aave",
        tokenDecimals: "18",

        logoUrl:
          "https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0x7Fc66500c84A76Ad7e9c93437bFc5Ac33E2DDaE9/logo.png",
      },
      {
        tokenAddress: "0x6c84a8f1c29108F47a79964b5Fe888D4f4D0dE40",
        tokenSymbol: "TBTC",
        tokenName: "tBTC",
        tokenDecimals: "18",

        logoUrl:
          "https://assets.coingecko.com/coins/images/11224/large/0x18084fba666a33d37592fa2633fd49a74dd93a88.png?1696511155",
      },
      {
        tokenAddress: "0x17FC002b466eEc40DaE837Fc4bE5c67993ddBd6F",
        tokenSymbol: "FRAX",
        tokenName: "Frax",
        tokenDecimals: "18",

        logoUrl:
          "https://assets.coingecko.com/coins/images/13422/large/FRAX_icon.png?1696513182",
      },
      {
        tokenAddress: "0x99F40b01BA9C469193B360f72740E416B17Ac332",
        tokenSymbol: "MATH",
        tokenName: "MATH",
        tokenDecimals: "18",

        logoUrl:
          "https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0x08d967bb0134F2d07f7cfb6E246680c53927DD30/logo.png",
      },
      {
        tokenAddress: "0x2e9a6Df78E42a30712c10a9Dc4b1C8656f8F2879",
        tokenSymbol: "MKR",
        tokenName: "Maker",
        tokenDecimals: "18",

        logoUrl:
          "https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0x9f8F72aA9304c8B593d555F12eF6589cC3A579A2/logo.png",
      },
      {
        tokenAddress: "0x74885b4D524d497261259B38900f54e6dbAd2210",
        tokenSymbol: "APE",
        tokenName: "ApeCoin",
        tokenDecimals: "18",

        logoUrl:
          "https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0x4d224452801ACEd8B2F0aebE155379bb5D594381/logo.png",
      },
      {
        tokenAddress: "0x040d1EdC9569d4Bab2D15287Dc5A4F10F56a56B8",
        tokenSymbol: "BAL",
        tokenName: "Balancer",
        tokenDecimals: "18",

        logoUrl:
          "https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0xba100000625a3754423978a60c9317c58a424e3D/logo.png",
      },
      {
        tokenAddress: "0x354A6dA3fcde098F8389cad84b0182725c6C91dE",
        tokenSymbol: "COMP",
        tokenName: "Compound",
        tokenDecimals: "18",

        logoUrl:
          "https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0xc00e94Cb662C3520282E6f5717214004A7f26888/logo.png",
      },
      {
        tokenAddress: "0x35E6A59F786d9266c7961eA28c7b768B33959cbB",
        tokenSymbol: "PEPE",
        tokenName: "Pepe",
        tokenDecimals: "18",

        logoUrl:
          "https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0x6982508145454Ce325dDbE47a25d4ec3d2311933/logo.png",
      },
      {
        tokenAddress: "0xaeF5bbcbFa438519a5ea80B4c7181B4E78d419f2",
        tokenSymbol: "RAI",
        tokenName: "Rai Reflex Index",
        tokenDecimals: "18",

        logoUrl:
          "https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0x03ab458634910AaD20eF5f1C8ee96F1D6ac54919/logo.png",
      },
      {
        tokenAddress: "0x84F5c2cFba754E76DD5aE4fB369CfC920425E12b",
        tokenSymbol: "CTX",
        tokenName: "Cryptex Finance",
        tokenDecimals: "18",

        logoUrl:
          "https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0x321C2fE4446C7c963dc41Dd58879AF648838f98D/logo.png",
      },
      {
        tokenAddress: "0x93b346b6BC2548dA6A1E7d98E9a421B42541425b",
        tokenSymbol: "LUSD",
        tokenName: "Liquity USD",
        tokenDecimals: "18",

        logoUrl:
          "https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0x5f98805A4E8be255a32880FDeC7F6728C6568bA0/logo.png",
      },
      {
        tokenAddress: "0xfeA31d704DEb0975dA8e77Bf13E04239e70d7c28",
        tokenSymbol: "ENS",
        tokenName: "EthereumtokenName Service",
        tokenDecimals: "18",

        logoUrl:
          "https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0xC18360217D8F7Ab5e7c516566761Ea12Ce7F9D72/logo.png",
      },
      {
        tokenAddress: "0x3E6648C5a70A150A88bCE65F4aD4d506Fe15d2AF",
        tokenSymbol: "SPELL",
        tokenName: "Spell Token",
        tokenDecimals: "18",

        logoUrl:
          "https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0x090185f2135308BaD17527004364eBcC2D37e5F6/logo.png",
      },
      {
        tokenAddress: "0xd4d42F0b6DEF4CE0383636770eF773390d85c61A",
        tokenSymbol: "SUSHI",
        tokenName: "Sushi",
        tokenDecimals: "18",

        logoUrl:
          "https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0x6B3595068778DD592e39A122f4f5a5cF09C90fE2/logo.png",
      },
      {
        tokenAddress: "0x3a8B787f78D775AECFEEa15706D4221B40F345AB",
        tokenSymbol: "CELR",
        tokenName: "Celer Network",
        tokenDecimals: "18",

        logoUrl:
          "https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0x4F9254C83EB525f9FCf346490bbb3ed28a81C667/logo.png",
      },
      {
        tokenAddress: "0xEf171a5BA71348eff16616fd692855c2Fe606EB2",
        tokenSymbol: "BLUR",
        tokenName: "Blur",
        tokenDecimals: "18",

        logoUrl:
          "https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0x5283D291DBCF85356A21bA090E6db59121208b44/logo.png",
      },
      {
        tokenAddress: "0x933d31561e470478079FEB9A6Dd2691fAD8234DF",
        tokenSymbol: "OCEAN",
        tokenName: "Ocean Protocol",
        tokenDecimals: "18",

        logoUrl:
          "https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0x967da4048cD07aB37855c090aAF366e4ce1b9F48/logo.png",
      },
      {
        tokenAddress: "0x3cFD99593a7F035F717142095a3898e3Fca7783e",
        tokenSymbol: "IMX",
        tokenName: "Immutable X",
        tokenDecimals: "18",

        logoUrl:
          "https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0xF57e7e7C23978C3cAEC3C3548E3D615c346e79fF/logo.png",
      },
      {
        tokenAddress: "0x7f9a7DB853Ca816B9A138AEe3380Ef34c437dEe0",
        tokenSymbol: "GTC",
        tokenName: "Gitcoin",
        tokenDecimals: "18",

        logoUrl:
          "https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0xDe30da39c46104798bB5aA3fe8B9e0e1F348163F/logo.png",
      },
      {
        tokenAddress: "0xa68Ec98D7ca870cF1Dd0b00EBbb7c4bF60A8e74d",
        tokenSymbol: "BICO",
        tokenName: "Biconomy",
        tokenDecimals: "18",
        logoUrl:
          "https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0xF17e65822b568B3903685a7c9F496CF7656Cc6C2/logo.png",
      },
      {
        tokenAddress: "0xdA0a57B710768ae17941a9Fa33f8B720c8bD9ddD",
        tokenSymbol: "POND",
        tokenName: "Marlin",
        tokenDecimals: "18",
        logoUrl:
          "https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0x57B946008913B82E4dF85f501cbAeD910e58D26C/logo.png",
      },
      {
        tokenAddress: "0x6314C31A7a1652cE482cffe247E9CB7c3f4BB9aF",
        tokenSymbol: "1INCH",
        tokenName: "1inch",
        tokenDecimals: "18",
        logoUrl:
          "https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0x111111111117dC0aa78b770fA6A738034120C302/logo.png",
      },
      {
        tokenAddress: "0xC7557C73e0eCa2E1BF7348bB6874Aee63C7eFF85",
        tokenSymbol: "QNT",
        tokenName: "Quant",
        tokenDecimals: "18",

        logoUrl:
          "https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0x4a220E6096B25EADb88358cb44068A3248254675/logo.png",
      },
      {
        tokenAddress: "0xFEa7a6a0B346362BF88A9e4A88416B77a57D6c2A",
        tokenSymbol: "MIM",
        tokenName: "Magic Internet Money",
        tokenDecimals: "18",
        logoUrl:
          "https://assets.coingecko.com/coins/images/16786/large/mimlogopng.png?1696516358",
      },
      {
        tokenAddress: "0xcAFcD85D8ca7Ad1e1C6F82F651fA15E33AEfD07b",
        tokenSymbol: "WOO",
        tokenName: "WOO Network",
        tokenDecimals: "18",
        logoUrl:
          "https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0x4691937a7508860F876c9c0a2a617E7d9E945D4B/logo.png",
      },
      {
        tokenAddress: "0xBfa641051Ba0a0Ad1b0AcF549a89536A0D76472E",
        tokenSymbol: "BADGER",
        tokenName: "Badger DAO",
        tokenDecimals: "18",
        logoUrl:
          "https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0x3472A5A71965499acd81997a54BBA8D852C6E53d/logo.png",
      },
      {
        tokenAddress: "0xa0b862F60edEf4452F25B4160F177db44DeB6Cf1",
        tokenSymbol: "GNO",
        tokenName: "Gnosis Token",
        tokenDecimals: "18",
        logoUrl:
          "https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0x6810e776880C02933D47DB1b9fc05908e5386b96/logo.png",
      },
      {
        tokenAddress: "0xfb9E5D956D889D91a82737B9bFCDaC1DCE3e1449",
        tokenSymbol: "LQTY",
        tokenName: "Liquity",
        tokenDecimals: "18",
        logoUrl:
          "https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0x6DEA81C8171D0bA574754EF6F8b412F2Ed88c54D/logo.png",
      },
    ],
  },
  {
    chainId: "10",
    chainName: "optimism",
    tokenList: [
      {
        tokenAddress: "0x0000000000000000000000000000000000000000",
        tokenDecimals: "18",
        tokenSymbol: "ETH",
        tokenName: "ETH",
        logoUrl: "https://cryptologos.cc/logos/ethereum-eth-logo.svg?v=032",
      },
      {
        tokenAddress: "0x4F604735c1cF31399C6E711D5962b2B3E0225AD3",
        tokenDecimals: "18",
        tokenSymbol: "USDGLO",
        tokenName: "Glo Dollar",
        logoUrl:
          "https://optimistic.etherscan.io/token/images/glodollar_32.png",
      },
      {
        tokenAddress: "0x4200000000000000000000000000000000000006",
        tokenDecimals: "18",
        tokenSymbol: "WETH",
        tokenName: "Wrapped Ether",
        logoUrl:
          "https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2/logo.png",
      },
      {
        tokenAddress: "0x0b2C639c533813f4Aa9D7837CAf62653d097Ff85",
        tokenDecimals: "6",
        tokenSymbol: "USDC",
        tokenName: "USDCoin",
        logoUrl:
          "https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png",
      },
      {
        tokenAddress: "0x7F5c764cBc14f9669B88837ca1490cCa17c31607",
        tokenDecimals: "6",
        tokenSymbol: "USDC.e",
        tokenName: "Bridged USDC",
        logoUrl:
          "https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png",
      },
      {
        tokenAddress: "0x4200000000000000000000000000000000000042",
        tokenDecimals: "18",
        tokenSymbol: "OP",
        tokenName: "Optimism",
        logoUrl:
          "https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/optimism/assets/0x4200000000000000000000000000000000000042/logo.png",
      },
      {
        tokenAddress: "0x94b008aA00579c1307B0EF2c499aD98a8ce58e58",
        tokenDecimals: "6",
        tokenSymbol: "USDT",
        tokenName: "Tether USD",
        logoUrl:
          "https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0xdAC17F958D2ee523a2206206994597C13D831ec7/logo.png",
      },
      {
        tokenAddress: "0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1",
        tokenDecimals: "18",
        tokenSymbol: "DAI",
        tokenName: "Dai Stablecoin",
        logoUrl:
          "https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0x6B175474E89094C44Da98b954EedeAC495271d0F/logo.png",
      },
      {
        tokenAddress: "0x68f180fcCe6836688e9084f035309E29Bf0A2095",
        tokenDecimals: "8",
        tokenSymbol: "WBTC",
        tokenName: "Wrapped BTC",
        logoUrl:
          "https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599/logo.png",
      },
      {
        tokenAddress: "0x8700dAec35aF8Ff88c16BdF0418774CB3D7599B4",
        tokenDecimals: "18",
        tokenSymbol: "SNX",
        tokenName: "Synthetix Network Token",
        logoUrl:
          "https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0xC011a73ee8576Fb46F5E1c5751cA3B9Fe0af2a6F/logo.png",
      },
      {
        tokenAddress: "0x9560e827aF36c94D2Ac33a39bCE1Fe78631088Db",
        tokenDecimals: "18",
        tokenSymbol: "VELO",
        tokenName: "Velodrome Finance",
        logoUrl:
          "https://assets.coingecko.com/coins/images/25783/large/velo.png?1696524870",
      },
      {
        tokenAddress: "0x350a791Bfc2C21F9Ed5d10980Dad2e2638ffa7f6",
        tokenDecimals: "18",
        tokenSymbol: "LINK",
        tokenName: "ChainLink Token",
        logoUrl:
          "https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0x514910771AF9Ca656af840dff83E8264EcF986CA/logo.png",
      },
      {
        tokenAddress: "0x9e1028F5F1D5eDE59748FFceE5532509976840E0",
        tokenDecimals: "18",
        tokenSymbol: "PERP",
        tokenName: "Perpetual Protocol",
        logoUrl:
          "https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0xbC396689893D065F41bc2C6EcbeE5e0085233447/logo.png",
      },
      {
        tokenAddress: "0x0994206dfE8De6Ec6920FF4D779B0d950605Fb53",
        tokenDecimals: "18",
        tokenSymbol: "CRV",
        tokenName: "Curve DAO Token",
        logoUrl:
          "https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0xD533a949740bb3306d119CC777fa900bA034cd52/logo.png",
      },
      {
        tokenAddress: "0x6c84a8f1c29108F47a79964b5Fe888D4f4D0dE40",
        tokenDecimals: "18",
        tokenSymbol: "TBTC",
        tokenName: "tBTC",
        logoUrl:
          "https://assets.coingecko.com/coins/images/11224/large/0x18084fba666a33d37592fa2633fd49a74dd93a88.png?1696511155",
      },
      {
        tokenAddress: "0x296F55F8Fb28E498B858d0BcDA06D955B2Cb3f97",
        tokenDecimals: "18",
        tokenSymbol: "STG",
        tokenName: "Stargate Finance",
        logoUrl:
          "https://assets.coingecko.com/coins/images/24413/large/STG_LOGO.png?1696523595",
      },
      {
        tokenAddress: "0x6fd9d7AD17242c41f7131d257212c54A0e816691",
        tokenDecimals: "18",
        tokenSymbol: "UNI",
        tokenName: "Uniswap",
        logoUrl:
          "https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984/logo.png",
      },
      {
        tokenAddress: "0x2E3D870790dC77A83DD1d18184Acc7439A53f475",
        tokenDecimals: "18",
        tokenSymbol: "FRAX",
        tokenName: "Frax",
        logoUrl:
          "https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0x853d955aCEf822Db058eb8505911ED77F175b99e/logo.png",
      },
      {
        tokenAddress: "0x9b88D293b7a791E40d36A39765FFd5A1B9b5c349",
        tokenDecimals: "18",
        tokenSymbol: "CELO",
        tokenName: "Celo native asset (Wormhole)",
        logoUrl:
          "https://assets.coingecko.com/coins/images/32400/large/celo_wh.png?1698055352",
      },
      {
        tokenAddress: "0x76FB31fb4af56892A25e32cFC43De717950c9278",
        tokenDecimals: "18",
        tokenSymbol: "AAVE",
        tokenName: "Aave",
        logoUrl:
          "https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0x7Fc66500c84A76Ad7e9c93437bFc5Ac33E2DDaE9/logo.png",
      },
      {
        tokenAddress: "0x65559aA14915a70190438eF90104769e5E890A00",
        tokenDecimals: "18",
        tokenSymbol: "ENS",
        tokenName: "Ethereum Name Service",
        logoUrl:
          "https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0xC18360217D8F7Ab5e7c516566761Ea12Ce7F9D72/logo.png",
      },
      {
        tokenAddress: "0x7FB688CCf682d58f86D7e38e03f9D22e7705448B",
        tokenDecimals: "18",
        tokenSymbol: "RAI",
        tokenName: "Rai Reflex Index",
        logoUrl:
          "https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0x03ab458634910AaD20eF5f1C8ee96F1D6ac54919/logo.png",
      },
      {
        tokenAddress: "0xc40F949F8a4e094D1b49a23ea9241D289B7b2819",
        tokenDecimals: "18",
        tokenSymbol: "LUSD",
        tokenName: "Liquity USD",
        logoUrl:
          "https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0x5f98805A4E8be255a32880FDeC7F6728C6568bA0/logo.png",
      },
      {
        tokenAddress: "0xFE8B128bA8C78aabC59d4c64cEE7fF28e9379921",
        tokenDecimals: "18",
        tokenSymbol: "BAL",
        tokenName: "Balancer",
        logoUrl:
          "https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0xba100000625a3754423978a60c9317c58a424e3D/logo.png",
      },
      {
        tokenAddress: "0xFdb794692724153d1488CcdBE0C56c252596735F",
        tokenDecimals: "18",
        tokenSymbol: "LDO",
        tokenName: "Lido DAO",
        logoUrl:
          "https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0x5A98FcBEA516Cf06857215779Fd812CA3beF1B32/logo.png",
      },
      {
        tokenAddress: "0xadDb6A0412DE1BA0F936DCaeb8Aaa24578dcF3B2",
        tokenDecimals: "18",
        tokenSymbol: "cbETH",
        tokenName: "Coinbase Wrapped Staked ETH",
        logoUrl:
          "https://assets.coingecko.com/coins/images/27008/large/cbeth.png?1709186989",
      },
      {
        tokenAddress: "0xB153FB3d196A8eB25522705560ac152eeEc57901",
        tokenDecimals: "18",
        tokenSymbol: "MIM",
        tokenName: "Magic Internet Money",
        logoUrl:
          "https://assets.coingecko.com/coins/images/16786/large/mimlogopng.png?1696516358",
      },
      {
        tokenAddress: "0xab7bAdEF82E9Fe11f6f33f87BC9bC2AA27F2fCB5",
        tokenDecimals: "18",
        tokenSymbol: "MKR",
        tokenName: "Maker",
        logoUrl:
          "https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0x9f8F72aA9304c8B593d555F12eF6589cC3A579A2/logo.png",
      },
      {
        tokenAddress: "0x5A5fFf6F753d7C11A56A52FE47a177a87e431655",
        tokenDecimals: "18",
        tokenSymbol: "SYN",
        tokenName: "Synapse",
        logoUrl:
          "https://assets.coingecko.com/coins/images/18024/large/synapse_social_icon.png?1696517540",
      },
    ],
  },
  {
    chainId: "59144",
    chainName: "linea",
    tokenList: [
      {
        tokenAddress: "0x0000000000000000000000000000000000000000",
        tokenDecimals: "18",
        tokenSymbol: "Linea",
        tokenName: "linea",
        logoUrl:
          "https://imagedelivery.net/XQ6LDks1pWNDtTDAw7o9nA/95e9b536-b0d5-432e-6736-a11c16070e00/public",
      },
      {
        tokenAddress: "0xa219439258ca9da29e9cc4ce5596924745e12b93",
        tokenDecimals: "6",
        tokenSymbol: "USDT",
        tokenName: "Tether USD",
        logoUrl: "https://lineascan.build/token/images/usdtlogo_32.png",
      },
      {
        tokenAddress: "0x176211869ca2b568f2a7d4ee941e073a821ee1ff",
        tokenDecimals: "6",
        tokenSymbol: "USDC",
        tokenName: "USDC",
        logoUrl: "https://lineascan.build/token/images/centre-usdc_28.png",
      },
      {
        tokenAddress: "0x99AD925C1Dc14Ac7cc6ca1244eeF8043C74E99d5",
        tokenDecimals: "18",
        tokenSymbol: "SHIB",
        tokenName: "SHIBA INU",
        logoUrl: "https://lineascan.build/token/images/shibainu_32.png",
      },
      {
        tokenAddress: "0x3aAB2285ddcDdaD8edf438C1bAB47e1a9D05a9b4",
        tokenDecimals: "8",
        tokenSymbol: "WBTC",
        tokenName: "Wrapped BTC",
        logoUrl: "https://lineascan.build/token/images/wbtc_28.png",
      },
      {
        tokenAddress: "0x5B16228B94b68C7cE33AF2ACc5663eBdE4dCFA2d",
        tokenDecimals: "18",
        tokenSymbol: "LINK",
        tokenName: "ChainLink Token",
        logoUrl: "https://lineascan.build/token/images/chainlink_32.png",
      },
      {
        tokenAddress: "0x636B22bC471c955A8DB60f28D4795066a8201fa3",
        tokenDecimals: "18",
        tokenSymbol: "UNI",
        tokenName: "Uniswap",
        logoUrl: "https://lineascan.build/token/images/uniswap_32.png",
      },
      {
        tokenAddress: "0x4AF15ec2A0BD43Db75dd04E62FAA3B8EF36b00d5",
        tokenDecimals: "18",
        tokenSymbol: "DAI",
        tokenName: "Dai Stablecoin",
        logoUrl: "https://lineascan.build/token/images/daistablecoin_32.png",
      },
      {
        tokenAddress: "0x7da14988E4f390C2E34ed41DF1814467D3aDe0c3",
        tokenDecimals: "18",
        tokenSymbol: "PEPE",
        tokenName: "Pepe",
        logoUrl: "https://lineascan.build/token/images/pepe_32.png",
      },
    ],
  },
  {
    chainId: "8453",
    chainName: "base",
    tokenList: [
      {
        tokenAddress: "0x0000000000000000000000000000000000000000",
        tokenDecimals: "18",
        tokenSymbol: "ETH",
        tokenName: "ETH",
        logoUrl:
          "https://imagedelivery.net/XQ6LDks1pWNDtTDAw7o9nA/cf2db6ea-299f-4934-360a-a928aa231700/public",
      },
      {
        tokenAddress: "0x4200000000000000000000000000000000000006",
        tokenDecimals: "18",
        tokenSymbol: "WETH",
        tokenName: "Wrapped Ether",
        logoUrl:
          "https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2/logo.png",
      },
      {
        tokenAddress: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
        tokenDecimals: "6",
        tokenSymbol: "USDC",
        tokenName: "USD Coin",
        logoUrl:
          "https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png",
      },
      {
        tokenAddress: "0xd9aAEc86B65D86f6A7B5B1b0c42FFA531710b6CA",
        tokenDecimals: "6",
        tokenSymbol: "USDbC",
        tokenName: "USD Base Coin",
        logoUrl:
          "https://coin-images.coingecko.com/coins/images/31164/large/baseusdc.jpg?1696529993",
      },
      {
        tokenAddress: "0x2Ae3F1Ec7F1F5012CFEab0185bfc7aa3cf0DEc22",
        tokenDecimals: "18",
        tokenSymbol: "cbETH",
        tokenName: "Coinbase Wrapped Staked ETH",
        logoUrl:
          "https://coin-images.coingecko.com/coins/images/27008/large/cbeth.png?1709186989",
      },
      {
        tokenAddress: "0x940181a94A35A4569E4529A3CDfB74e38FD98631",
        tokenDecimals: "18",
        tokenSymbol: "AERO",
        tokenName: "Aerodrome",
        logoUrl:
          "https://coin-images.coingecko.com/coins/images/31745/large/token.png?1696530564",
      },
      {
        tokenAddress: "0x50c5725949A6F0c72E6C4a641F24049A917DB0Cb",
        tokenDecimals: "18",
        tokenSymbol: "DAI",
        tokenName: "Dai Stablecoin",
        logoUrl:
          "https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0x6B175474E89094C44Da98b954EedeAC495271d0F/logo.png",
      },
      {
        tokenAddress: "0x6985884C4392D348587B19cb9eAAf157F13271cd",
        tokenDecimals: "18",
        tokenSymbol: "ZRO",
        tokenName: "LayerZero",
        logoUrl:
          "https://coin-images.coingecko.com/coins/images/28206/large/ftxG9_TJ_400x400.jpeg?1696527208",
      },
      {
        tokenAddress: "0xfA980cEd6895AC314E7dE34Ef1bFAE90a5AdD21b",
        tokenDecimals: "18",
        tokenSymbol: "PRIME",
        tokenName: "Prime",
        logoUrl:
          "https://coin-images.coingecko.com/coins/images/29053/large/prime-logo-small-border_%282%29.png?1696528020",
      },
      {
        tokenAddress: "0x236aa50979D5f3De3Bd1Eeb40E81137F22ab794b",
        tokenDecimals: "18",
        tokenSymbol: "tBTC",
        tokenName: "Base tBTC v2",
        logoUrl:
          "https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0x18084fbA666a33d37592fA2633fD49a74DD93a88/logo.png",
      },
      {
        tokenAddress: "0x489fe42C267fe0366B16b0c39e7AEEf977E841eF",
        tokenDecimals: "18",
        tokenSymbol: "WAMPL",
        tokenName: "Wrapped Ampleforth",
        logoUrl:
          "https://coin-images.coingecko.com/coins/images/20825/large/photo_2021-11-25_02-05-11.jpg?1696520218",
      },
      {
        tokenAddress: "0x97c806e7665d3AFd84A8Fe1837921403D59F3Dcc",
        tokenDecimals: "18",
        tokenSymbol: "ALI",
        tokenName: "Artificial Liquid Intelligence Token",
        logoUrl:
          "https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0x6B0b3a982b4634aC68dD83a4DBF02311cE324181/logo.png",
      },
      {
        tokenAddress: "0x18dD5B087bCA9920562aFf7A0199b96B9230438b",
        tokenDecimals: "8",
        tokenSymbol: "PRO",
        tokenName: "Propy",
        logoUrl:
          "https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0x226bb599a12C826476e3A771454697EA52E9E220/logo.png",
      },
      {
        tokenAddress: "0x9e81F6495BA29a6B4D48bDdD042C0598fA8abc9F",
        tokenDecimals: "18",
        tokenSymbol: "MATH",
        tokenName: "MATH Token",
        logoUrl:
          "https://coin-images.coingecko.com/coins/images/11335/large/2020-05-19-token-200.png?1696511257",
      },
      {
        tokenAddress: "0x9e1028F5F1D5eDE59748FFceE5532509976840E0",
        tokenDecimals: "18",
        tokenSymbol: "COMP",
        tokenName: "Compound",
        logoUrl:
          "https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0xc00e94Cb662C3520282E6f5717214004A7f26888/logo.png",
      },
      {
        tokenAddress: "0xcD2F22236DD9Dfe2356D7C543161D4d260FD9BcB",
        tokenDecimals: "18",
        tokenSymbol: "GHST",
        tokenName: "Aavegotchi GHST Token",
        logoUrl:
          "https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0x3F382DbD960E3a9bbCeaE22651E88158d2791550/logo.png",
      },
      {
        tokenAddress: "0xBCBAf311ceC8a4EAC0430193A528d9FF27ae38C1",
        tokenDecimals: "18",
        tokenSymbol: "IOTX",
        tokenName: "IoTeX",
        logoUrl:
          "https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0x6fB3e0A217407EFFf7Ca062D46c26E5d60a14d69/logo.png",
      },
      {
        tokenAddress: "0xc3De830EA07524a0761646a6a4e4be0e114a3C83",
        tokenDecimals: "18",
        tokenSymbol: "UNI",
        tokenName: "Uniswap",
        logoUrl:
          "https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984/logo.png",
      },
      {
        tokenAddress: "0xE3B53AF74a4BF62Ae5511055290838050bf764Df",
        tokenDecimals: "18",
        tokenSymbol: "STG",
        tokenName: "Stargate Finance",
        logoUrl:
          "https://coin-images.coingecko.com/coins/images/24413/large/STG_LOGO.png?1696523595",
      },
      {
        tokenAddress: "0xc5fecC3a29Fb57B5024eEc8a2239d4621e111CBE",
        tokenDecimals: "18",
        tokenSymbol: "1INCH",
        tokenName: "1INCH Token",
        logoUrl:
          "https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0x111111111117dC0aa78b770fA6A738034120C302/logo.png",
      },
      {
        tokenAddress: "0xD08a2917653d4E460893203471f0000826fb4034",
        tokenDecimals: "18",
        tokenSymbol: "FARM",
        tokenName: "FARM Reward Token",
        logoUrl:
          "https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0xa0246c9032bC3A600820415aE600c6388619A14D/logo.png",
      },
      {
        tokenAddress: "0x22e6966B799c4D5B13BE962E1D117b56327FDa66",
        tokenDecimals: "18",
        tokenSymbol: "SNX",
        tokenName: "Synthetix Network Token",
        logoUrl:
          "https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0xC011a73ee8576Fb46F5E1c5751cA3B9Fe0af2a6F/logo.png",
      },
      {
        tokenAddress: "0x4158734D47Fc9692176B5085E0F52ee0Da5d47F1",
        tokenDecimals: "18",
        tokenSymbol: "BAL",
        tokenName: "Balancer",
        logoUrl:
          "https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0xba100000625a3754423978a60c9317c58a424e3D/logo.png",
      },
      {
        tokenAddress: "0x3bB4445D30AC020a84c1b5A8A2C6248ebC9779D0",
        tokenDecimals: "18",
        tokenSymbol: "ZRX",
        tokenName: "0x Protocol Token",
        logoUrl:
          "https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0xE41d2489571d322189246DaFA5ebDe1F4699F498/logo.png",
      },
      {
        tokenAddress: "0x7D49a065D17d6d4a55dc13649901fdBB98B2AFBA",
        tokenDecimals: "18",
        tokenSymbol: "SUSHI",
        tokenName: "Sushi",
        logoUrl:
          "https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0x6B3595068778DD592e39A122f4f5a5cF09C90fE2/logo.png",
      },
      {
        tokenAddress: "0x8Ee73c484A26e0A5df2Ee2a4960B789967dd0415",
        tokenDecimals: "18",
        tokenSymbol: "CRV",
        tokenName: "Curve DAO Token",
        logoUrl:
          "https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0xD533a949740bb3306d119CC777fa900bA034cd52/logo.png",
      },
      {
        tokenAddress: "0xA7d68d155d17cB30e311367c2Ef1E82aB6022b67",
        tokenDecimals: "18",
        tokenSymbol: "BTRST",
        tokenName: "BTRST",
        logoUrl:
          "https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0x799ebfABE77a6E34311eeEe9825190B9ECe32824/logo.png",
      },
    ],
  },
  {
    chainId: "7777777",
    chainName: "zora",
    tokenList: [
      {
        tokenAddress: "0x0000000000000000000000000000000000000000",
        tokenDecimals: "18",
        tokenSymbol: "ZORA",
        tokenName: "ZORA",
        logoUrl: "",
      },
      {
        tokenAddress: "0xD838D5b87439e17B0194fd43e37300cD99Aa3DE0",
        tokenDecimals: "18",
        tokenSymbol: "MERK",
        tokenName: "Merkly OFT",
        logoUrl: "",
      },
      {
        tokenAddress: "0xCccCCccc7021b32EBb4e8C08314bD62F7c653EC4",
        tokenDecimals: "18",
        tokenSymbol: "ZORA",
        tokenName: "USD Coin (Bridged from Ethereum)",
        logoUrl: "USDzC",
      },
    ],
  },
  {
    chainId: "204",
    chainName: "opBnb",
    tokenList: [
      {
        tokenAddress: "0x0000000000000000000000000000000000000000",
        tokenDecimals: "18",
        tokenSymbol: "opBnb",
        tokenName: "opBnb",
        logoUrl: "",
      },
    ],
  },
  {
    chainId: "42220",
    chainName: "Celo",
    tokenList: [
      {
        tokenAddress: "0x0000000000000000000000000000000000000000",
        tokenDecimals: "18",
        tokenSymbol: "Celo",
        tokenName: "Celo",
        logoUrl: "",
      },
    ],
  },
  {
    chainId: "137",
    chainName: "polygon",
    tokenList: [
      {
        tokenAddress: "0x0000000000000000000000000000000000000000",
        tokenDecimals: "18",
        tokenSymbol: "MATIC",
        tokenName: "matic",
        logoUrl:
          "https://imagedelivery.net/XQ6LDks1pWNDtTDAw7o9nA/1f9a04e7-bf43-476d-4705-506297e2de00/public",
      },
      {
        tokenAddress: "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",
        tokenSymbol: "USDC.e",
        tokenName: "Bridged USDC",
        tokenDecimals: "6",
        logoUrl:
          "https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png",
      },
      {
        tokenAddress: "0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619",
        tokenSymbol: "WETH",
        tokenName: "Wrapped Ether",
        tokenDecimals: "18",
        logoUrl:
          "https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2/logo.png",
      },
      {
        tokenAddress: "0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270",
        tokenSymbol: "WMATIC",
        tokenName: "Wrapped Matic",
        tokenDecimals: "18",
        logoUrl:
          "https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/polygon/assets/0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270/logo.png",
      },
      {
        tokenAddress: "0x1BFD67037B42Cf73acF2047067bd4F2C47D9BfD6",
        tokenSymbol: "WBTC",
        tokenName: "Wrapped BTC",
        tokenDecimals: "8",
        logoUrl:
          "https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599/logo.png",
      },
      {
        tokenAddress: "0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359",
        tokenSymbol: "USDC",
        tokenName: "USDCoin",
        tokenDecimals: "6",
        logoUrl:
          "https://assets.coingecko.com/coins/images/6319/large/usdc.png?1696506694",
      },
      {
        tokenAddress: "0xc2132D05D31c914a87C6611C10748AEb04B58e8F",
        tokenSymbol: "USDT",
        tokenName: "Tether USD",
        tokenDecimals: "6",
        logoUrl:
          "https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0xdAC17F958D2ee523a2206206994597C13D831ec7/logo.png",
      },
      {
        tokenAddress: "0x61299774020dA444Af134c82fa83E3810b309991",
        tokenSymbol: "RNDR",
        tokenName: "Render Token",
        tokenDecimals: "18",
        logoUrl:
          "https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0x6De037ef9aD2725EB40118Bb1702EBb27e4Aeb24/logo.png",
      },
      {
        tokenAddress: "0x53E0bca35eC356BD5ddDFebbD1Fc0fD03FaBad39",
        tokenSymbol: "LINK",
        tokenName: "ChainLink Token",
        tokenDecimals: "18",
        logoUrl:
          "https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0x514910771AF9Ca656af840dff83E8264EcF986CA/logo.png",
      },
      {
        tokenAddress: "0xD6DF932A45C0f255f85145f286eA0b292B21C90B",
        tokenSymbol: "AAVE",
        tokenName: "Aave",
        tokenDecimals: "18",
        logoUrl:
          "https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0x7Fc66500c84A76Ad7e9c93437bFc5Ac33E2DDaE9/logo.png",
      },
      {
        tokenAddress: "0xC3C7d422809852031b44ab29EEC9F1EfF2A58756",
        tokenSymbol: "LDO",
        tokenName: "Lido DAO",
        tokenDecimals: "18",
        logoUrl:
          "https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0x5A98FcBEA516Cf06857215779Fd812CA3beF1B32/logo.png",
      },
      {
        tokenAddress: "0xDC3326e71D45186F113a2F448984CA0e8D201995",
        tokenSymbol: "XSGD",
        tokenName: "XSGD",
        tokenDecimals: "6",
        logoUrl:
          "https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0x70e8dE73cE538DA2bEEd35d14187F6959a8ecA96/logo.png",
      },
      {
        tokenAddress: "0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063",
        tokenSymbol: "DAI",
        tokenName: "Dai Stablecoin",
        tokenDecimals: "18",
        logoUrl:
          "https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0x6B175474E89094C44Da98b954EedeAC495271d0F/logo.png",
      },
      {
        tokenAddress: "0xd0258a3fD00f38aa8090dfee343f10A9D4d30D3F",
        tokenSymbol: "VOXEL",
        tokenName: "Voxies",
        tokenDecimals: "18",
        logoUrl:
          "https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/polygon/assets/0xd0258a3fD00f38aa8090dfee343f10A9D4d30D3F/logo.png",
      },
      {
        tokenAddress: "0x9ff62d1FC52A907B6DCbA8077c2DDCA6E6a9d3e1",
        tokenSymbol: "FORT",
        tokenName: "Forta",
        tokenDecimals: "18",
        logoUrl:
          "https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0x41545f8b9472D758bB669ed8EaEEEcD7a9C4Ec29/logo.png",
      },
      {
        tokenAddress: "0x5fe2B58c013d7601147DcdD68C143A77499f5531",
        tokenSymbol: "GRT",
        tokenName: "The Graph",
        tokenDecimals: "18",
        logoUrl:
          "https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0xc944E90C64B2c07662A292be6244BDf05Cda44a7/logo.png",
      },
      {
        tokenAddress: "0xb33EaAd8d922B1083446DC23f610c2567fB5180f",
        tokenSymbol: "UNI",
        tokenName: "Uniswap",
        tokenDecimals: "18",
        logoUrl:
          "https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984/logo.png",
      },
      {
        tokenAddress: "0x0B220b82F3eA3B7F6d9A1D8ab58930C064A2b5Bf",
        tokenSymbol: "GLM",
        tokenName: "Golem",
        tokenDecimals: "18",
        logoUrl:
          "https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0x7DD9c5Cba05E151C895FDe1CF355C9A1D5DA6429/logo.png",
      },
      {
        tokenAddress: "0xd93f7E271cB87c23AaA73edC008A79646d1F9912",
        tokenSymbol: "SOL",
        tokenName: "SOL  Wormhole ",
        tokenDecimals: "9",
        logoUrl:
          "https://assets.coingecko.com/coins/images/22876/large/SOL_wh_small.png?1696522175",
      },
      {
        tokenAddress: "0x45c32fA6DF82ead1e2EF74d17b76547EDdFaFF89",
        tokenSymbol: "FRAX",
        tokenName: "Frax",
        tokenDecimals: "18",
        logoUrl:
          "https://assets.coingecko.com/coins/images/13422/large/FRAX_icon.png?1696513182",
      },
      {
        tokenAddress: "0x50B728D8D964fd00C2d0AAD81718b71311feF68a",
        tokenSymbol: "SNX",
        tokenName: "Synthetix Network Token",
        tokenDecimals: "18",
        logoUrl:
          "https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0xC011a73ee8576Fb46F5E1c5751cA3B9Fe0af2a6F/logo.png",
      },
      {
        tokenAddress: "0x172370d5Cd63279eFa6d502DAB29171933a610AF",
        tokenSymbol: "CRV",
        tokenName: "Curve DAO Token",
        tokenDecimals: "18",
        logoUrl:
          "https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0xD533a949740bb3306d119CC777fa900bA034cd52/logo.png",
      },
      {
        tokenAddress: "0x9a71012B13CA4d3D0Cdc72A177DF3ef03b0E76A3",
        tokenSymbol: "BAL",
        tokenName: "Balancer",
        tokenDecimals: "18",
        logoUrl:
          "https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0xba100000625a3754423978a60c9317c58a424e3D/logo.png",
      },
      {
        tokenAddress: "0x82617aA52dddf5Ed9Bb7B370ED777b3182A30fd1",
        tokenSymbol: "YGG",
        tokenName: "Yield Guild Games",
        tokenDecimals: "18",
        logoUrl:
          "https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0x25f8087EAD173b73D6e8B84329989A8eEA16CF73/logo.png",
      },
      {
        tokenAddress: "0x0b3F868E0BE5597D5DB7fEB59E1CADBb0fdDa50a",
        tokenSymbol: "SUSHI",
        tokenName: "Sushi",
        tokenDecimals: "18",
        logoUrl:
          "https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0x6B3595068778DD592e39A122f4f5a5cF09C90fE2/logo.png",
      },
      {
        tokenAddress: "0x282d8efCe846A88B159800bd4130ad77443Fa1A1",
        tokenSymbol: "OCEAN",
        tokenName: "Ocean Protocol",
        tokenDecimals: "18",
        logoUrl:
          "https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0x967da4048cD07aB37855c090aAF366e4ce1b9F48/logo.png",
      },
      {
        tokenAddress: "0xBbba073C31bF03b8ACf7c28EF0738DeCF3695683",
        tokenSymbol: "SAND",
        tokenName: "The Sandbox",
        tokenDecimals: "18",
        logoUrl:
          "https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0x3845badAde8e6dFF049820680d1F14bD3903a5d0/logo.png",
      },
      {
        tokenAddress: "0x00e5646f60AC6Fb446f621d146B6E1886f002905",
        tokenSymbol: "RAI",
        tokenName: "Rai Reflex Index",
        tokenDecimals: "18",
        logoUrl:
          "https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0x03ab458634910AaD20eF5f1C8ee96F1D6ac54919/logo.png",
      },
      {
        tokenAddress: "0x2F6F07CDcf3588944Bf4C42aC74ff24bF56e7590",
        tokenSymbol: "STG",
        tokenName: "Stargate Finance",
        tokenDecimals: "18",
        logoUrl:
          "https://assets.coingecko.com/coins/images/24413/large/STG_LOGO.png?1696523595",
      },
      {
        tokenAddress: "0xE0B52e49357Fd4DAf2c15e02058DCE6BC0057db4",
        tokenSymbol: "agEUR",
        tokenName: "agEur",
        tokenDecimals: "18",
        logoUrl:
          "https://assets.coingecko.com/coins/images/19479/large/agEUR-4.png?1710726218",
      },
      {
        tokenAddress: "0x6f7C932e7684666C9fd1d44527765433e01fF61d",
        tokenSymbol: "MKR",
        tokenName: "Maker",
        tokenDecimals: "18",
        logoUrl:
          "https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0x9f8F72aA9304c8B593d555F12eF6589cC3A579A2/logo.png",
      },
      {
        tokenAddress: "0xA1c57f48F0Deb89f569dFbE6E2B7f46D33606fD4",
        tokenSymbol: "MANA",
        tokenName: "Decentraland",
        tokenDecimals: "18",
        logoUrl:
          "https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0x0F5D2fB29fb7d3CFeE444a200298f468908cC942/logo.png",
      },
      {
        tokenAddress: "0xB7b31a6BC18e48888545CE79e83E06003bE70930",
        tokenSymbol: "APE",
        tokenName: "ApeCoin",
        tokenDecimals: "18",
        logoUrl:
          "https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0x4d224452801ACEd8B2F0aebE155379bb5D594381/logo.png",
      },
      {
        tokenAddress: "0xbFc70507384047Aa74c29Cdc8c5Cb88D0f7213AC",
        tokenSymbol: "ALI",
        tokenName: "Alethea Artificial Liquid Intelligence",
        tokenDecimals: "18",
        logoUrl:
          "https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0x6B0b3a982b4634aC68dD83a4DBF02311cE324181/logo.png",
      },
      {
        tokenAddress: "0x553d3D295e0f695B9228246232eDF400ed3560B5",
        tokenSymbol: "PAXG",
        tokenName: "PAX Gold",
        tokenDecimals: "18",
        logoUrl:
          "https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0x45804880De22913dAFE09f4980848ECE6EcbAf78/logo.png",
      },
      {
        tokenAddress: "0x385Eeac5cB85A38A9a07A70c73e0a3271CfB54A7",
        tokenSymbol: "GHST",
        tokenName: "Aavegotchi",
        tokenDecimals: "18",
        logoUrl:
          "https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0x3F382DbD960E3a9bbCeaE22651E88158d2791550/logo.png",
      },
      {
        tokenAddress: "0x6f8a06447Ff6FcF75d803135a7de15CE88C1d4ec",
        tokenSymbol: "SHIB",
        tokenName: "Shiba Inu",
        tokenDecimals: "18",
        logoUrl:
          "https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0x95aD61b0a150d79219dCF64E1E6Cc01f0B64C4cE/logo.png",
      },
      {
        tokenAddress: "0x104592a158490a9228070E0A8e5343B499e125D0",
        tokenSymbol: "FRAX",
        tokenName: "Frax",
        tokenDecimals: "18",
        logoUrl:
          "https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0x853d955aCEf822Db058eb8505911ED77F175b99e/logo.png",
      },
      {
        tokenAddress: "0x7583FEDDbceFA813dc18259940F76a02710A8905",
        tokenSymbol: "FET",
        tokenName: "Fetch ai",
        tokenDecimals: "18",
        logoUrl:
          "https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0xaea46A60368A7bD060eec7DF8CBa43b7EF41Ad85/logo.png",
      },
      {
        tokenAddress: "0x8505b9d2254A7Ae468c0E9dd10Ccea3A837aef5c",
        tokenSymbol: "COMP",
        tokenName: "Compound",
        tokenDecimals: "18",
        logoUrl:
          "https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0xc00e94Cb662C3520282E6f5717214004A7f26888/logo.png",
      },
      {
        tokenAddress: "0x9c2C5fd7b07E95EE044DDeba0E97a665F142394f",
        tokenSymbol: "1INCH",
        tokenName: "1inch",
        tokenDecimals: "18",
        logoUrl:
          "https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0x111111111117dC0aa78b770fA6A738034120C302/logo.png",
      },
      {
        tokenAddress: "0x1a3acf6D19267E2d3e7f898f42803e90C9219062",
        tokenSymbol: "FXS",
        tokenName: "Frax Share",
        tokenDecimals: "18",
        logoUrl:
          "https://assets.coingecko.com/coins/images/13423/large/Frax_Shares_icon.png?1696513183",
      },
      {
        tokenAddress: "0xf8F9efC0db77d8881500bb06FF5D6ABc3070E695",
        tokenSymbol: "SYN",
        tokenName: "Synapse",
        tokenDecimals: "18",
        logoUrl:
          "https://assets.coingecko.com/coins/images/18024/large/synapse_social_icon.png?1696517540",
      },
      {
        tokenAddress: "0x236aa50979D5f3De3Bd1Eeb40E81137F22ab794b",
        tokenSymbol: "TBTC",
        tokenName: "tBTC",
        tokenDecimals: "18",
        logoUrl:
          "https://assets.coingecko.com/coins/images/11224/large/0x18084fba666a33d37592fa2633fd49a74dd93a88.png?1696511155",
      },
      {
        tokenAddress: "0xE0339c80fFDE91F3e20494Df88d4206D86024cdF",
        tokenSymbol: "ELON",
        tokenName: "Dogelon Mars",
        tokenDecimals: "18",
        logoUrl:
          "https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0x761D38e5ddf6ccf6Cf7c55759d5210750B5D60F3/logo.png",
      },
      {
        tokenAddress: "0x65A05DB8322701724c197AF82C9CaE41195B0aA8",
        tokenSymbol: "FOX",
        tokenName: "ShapeShift FOX Token",
        tokenDecimals: "18",
        logoUrl:
          "https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0xc770EEfAd204B5180dF6a14Ee197D99d808ee52d/logo.png",
      },
      {
        tokenAddress: "0xdAb529f40E671A1D4bF91361c21bf9f0C9712ab7",
        tokenSymbol: "BUSD",
        tokenName: "Binance USD",
        tokenDecimals: "18",
        logoUrl:
          "https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0x4Fabb145d64652a948d72533023f6E7A623C7C53/logo.png",
      },
      {
        tokenAddress: "0x101A023270368c0D50BFfb62780F4aFd4ea79C35",
        tokenSymbol: "ANKR",
        tokenName: "Ankr",
        tokenDecimals: "18",
        logoUrl:
          "https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0x8290333ceF9e6D528dD5618Fb97a76f268f3EDD4/logo.png",
      },
      {
        tokenAddress: "0xa9f37D84c856fDa3812ad0519Dad44FA0a3Fe207",
        tokenSymbol: "MLN",
        tokenName: "Melon",
        tokenDecimals: "18",
        logoUrl:
          "https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0xec67005c4E498Ec7f55E092bd1d35cbC47C91892/logo.png",
      },
      {
        tokenAddress: "0x9Cb74C8032b007466865f060ad2c46145d45553D",
        tokenSymbol: "IDEX",
        tokenName: "IDEX",
        tokenDecimals: "18",
        logoUrl:
          "https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0xB705268213D593B8FD88d3FDEFF93AFF5CbDcfAE/logo.png",
      },
      {
        tokenAddress: "0xf6372cDb9c1d3674E83842e3800F2A62aC9F3C66",
        tokenSymbol: "IOTX",
        tokenName: "IoTeX",
        tokenDecimals: "18",
        logoUrl:
          "https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0x6fB3e0A217407EFFf7Ca062D46c26E5d60a14d69/logo.png",
      },
      {
        tokenAddress: "0x49a0400587A7F65072c87c4910449fDcC5c47242",
        tokenSymbol: "MIM",
        tokenName: "Magic Internet Money",
        tokenDecimals: "18",
        logoUrl:
          "https://assets.coingecko.com/coins/images/16786/large/mimlogopng.png?1696516358",
      },
      {
        tokenAddress: "0xa1428174F516F527fafdD146b883bB4428682737",
        tokenSymbol: "SUPER",
        tokenName: "SuperFarm",
        tokenDecimals: "18",
        logoUrl:
          "https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0xe53EC727dbDEB9E2d5456c3be40cFF031AB40A55/logo.png",
      },
      {
        tokenAddress: "0xDA537104D6A5edd53c6fBba9A898708E465260b6",
        tokenSymbol: "YFI",
        tokenName: "yearn finance",
        tokenDecimals: "18",
        logoUrl:
          "https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0x0bc529c00C6401aEF6D220BE8C6Ea1667F6Ad93e/logo.png",
      },
      {
        tokenAddress: "0x831753DD7087CaC61aB5644b308642cc1c33Dc13",
        tokenSymbol: "QUICK",
        tokenName: "Quickswap",
        tokenDecimals: "18",
        logoUrl:
          "https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0x6c28AeF8977c9B773996d0e8376d2EE379446F2f/logo.png",
      },
      {
        tokenAddress: "0xA3c322Ad15218fBFAEd26bA7f616249f7705D945",
        tokenSymbol: "MV",
        tokenName: "GensoKishi Metaverse",
        tokenDecimals: "18",
        logoUrl:
          "https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0xAE788F80F2756A86aa2F410C651F2aF83639B95b/logo.png",
      },
      {
        tokenAddress: "0x1B815d120B3eF02039Ee11dC2d33DE7aA4a8C603",
        tokenSymbol: "WOO",
        tokenName: "WOO Network",
        tokenDecimals: "18",
        logoUrl:
          "https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0x4691937a7508860F876c9c0a2a617E7d9E945D4B/logo.png",
      },
      {
        tokenAddress: "0xAdA58DF0F643D959C2A47c9D4d4c1a4deFe3F11C",
        tokenSymbol: "CRO",
        tokenName: "Cronos",
        tokenDecimals: "8",
        logoUrl:
          "https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0xA0b73E1Ff0B80914AB6fe0444E65848C4C34450b/logo.png",
      },
      {
        tokenAddress: "0x3Cef98bb43d732E2F285eE605a8158cDE967D219",
        tokenSymbol: "BAT",
        tokenName: "Basic Attention Token",
        tokenDecimals: "18",
        logoUrl:
          "https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0x0D8775F648430679A709E98d2b0Cb6250d2887EF/logo.png",
      },
      {
        tokenAddress: "0xc26D47d5c33aC71AC5CF9F776D63Ba292a4F7842",
        tokenSymbol: "BNT",
        tokenName: "Bancor Network Token",
        tokenDecimals: "18",
        logoUrl:
          "https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C/logo.png",
      },
      {
        tokenAddress: "0x70c006878a5A50Ed185ac4C87d837633923De296",
        tokenSymbol: "REVV",
        tokenName: "REVV",
        tokenDecimals: "18",
        logoUrl:
          "https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0x557B933a7C2c45672B610F8954A3deB39a51A8Ca/logo.png",
      },
      {
        tokenAddress: "0x4C3bF0a3DE9524aF68327d1D2558a3B70d17D42a",
        tokenSymbol: "DYDX",
        tokenName: "dYdX",
        tokenDecimals: "18",
        logoUrl:
          "https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0x92D6C1e31e14520e676a687F0a93788B716BEff5/logo.png",
      },
      {
        tokenAddress: "0x0621d647cecbFb64b79E44302c1933cB4f27054d",
        tokenSymbol: "AMP",
        tokenName: "Amp",
        tokenDecimals: "18",
        logoUrl:
          "https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0xfF20817765cB7f73d4bde2e66e067E58D11095C2/logo.png",
      },
      {
        tokenAddress: "0xEE800B277A96B0f490a1A732e1D6395FAD960A26",
        tokenSymbol: "ARPA",
        tokenName: "ARPA Chain",
        tokenDecimals: "18",
        logoUrl:
          "https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0xBA50933C268F567BDC86E1aC131BE072C6B0b71a/logo.png",
      },
      {
        tokenAddress: "0xf1938Ce12400f9a761084E7A80d37e732a4dA056",
        tokenSymbol: "CHZ",
        tokenName: "Chiliz",
        tokenDecimals: "18",
        logoUrl:
          "https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0x3506424F91fD33084466F402d5D97f05F8e3b4AF/logo.png",
      },
    ],
  },
  {
    chainId: "97",
    chainName: "bsc test net",
    tokenList: [
      {
        tokenAddress: "0x0000000000000000000000000000000000000000",
        tokenDecimals: "18",
        tokenName: "bnb",
        tokenSymbol: "BNB",
        logoUrl:
          "https://imagedelivery.net/XQ6LDks1pWNDtTDAw7o9nA/cf2db6ea-299f-4934-360a-a928aa231700/public",
      },
    ],
  },
];
