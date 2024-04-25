import { Ether, NativeCurrency, Token, WETH9 } from "@uniswap/sdk-core";

import { SupportedChainId } from "./chains";
import { TokenInformation } from "@/types";

export const USDC_MAINNET = new Token(
  SupportedChainId.MAINNET,
  "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
  6,
  "USDC",
  "USD//C",
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
  address: "0x83FF60E2f93F8eDD0637Ef669C69D5Fb4f64cA8E",
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
        tokenName: "Arbitrum",
        tokenSymbol: "Arbitrum",
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
        tokenSymbol: "Optimism",
        tokenName: "Optimism",
        logoUrl:
          "https://imagedelivery.net/XQ6LDks1pWNDtTDAw7o9nA/cef210ce-85ba-4482-f3bb-bbc5f6ecb200/public",
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
];
