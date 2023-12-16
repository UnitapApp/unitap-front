import {
  avalanche,
  bsc,
  polygon,
  fantom,
  holesky,
  goerli,
  polygonMumbai,
  bscTestnet,
  gnosis,
  meter,
  zetachainAthensTestnet,
  scroll,
  xdc,
} from "viem/chains";
import { mainnet, sepolia } from "wagmi";

const IDChain = {
  id: 74,
  name: "IDChain Mainnet",
  nativeCurrency: {
    decimals: 18,
    name: "EIDI",
    symbol: "EIDI",
  },
  network: "IDChain",
  rpcUrls: {
    default: { http: ["https://idchain.one/rpc/"] },
    public: { http: ["https://idchain.one/rpc/"] },
  },
};

const Optimism = {
  id: 10,
  name: "Optimism",
  nativeCurrency: {
    decimals: 18,
    name: "ETH",
    symbol: "ETH",
  },
  network: "Optimism",
  rpcUrls: {
    default: { http: ["https://rpc.ankr.com/optimism"] },
    public: { http: ["https://rpc.ankr.com/optimism"] },
  },
  blockExplorers: {
    etherscan: { name: "etherscan", url: "https://optimistic.etherscan.io" },
    default: { name: "etherscan", url: "https://optimistic.etherscan.io" },
  },

  // explorerUrl: "https://optimistic.etherscan.io/",
  // rpcUrl: "https://rpc.ankr.com/optimism",
  // logoUrl:
  //   "https://imagedelivery.net/XQ6LDks1pWNDtTDAw7o9nA/cef210ce-85ba-4482-f3bb-bbc5f6ecb200/public",
  // modalUrl:
  //   "https://imagedelivery.net/XQ6LDks1pWNDtTDAw7o9nA/cef210ce-85ba-4482-f3bb-bbc5f6ecb200/public",
  // gasImageUrl:
  //   "https://imagedelivery.net/XQ6LDks1pWNDtTDAw7o9nA/cef210ce-85ba-4482-f3bb-bbc5f6ecb200/public",
  // maxClaimAmount: 50000000000000.0,
  // isTestnet: false,
  // tokentapContractAddress: "0x54a839FF128DC1891a03d7a81724bD5D51A5902b",
  // chainType: "EVM",
  // blockScanAddress:
  //   "https://optimistic.etherscan.io/address/0xb3A97684Eb67182BAa7994b226e6315196D8b364",
};

export const supportedChains = [
  sepolia,
  mainnet,
  avalanche,
  bsc,
  polygon,
  fantom,
  holesky,
  goerli,
  polygonMumbai,
  bscTestnet,
  gnosis,
  IDChain,
  Optimism,
  meter,
  zetachainAthensTestnet,
  scroll,
  xdc,
];

/**
 * List of all the networks supported by the Uniswap Interface
 */
export enum SupportedChainId {
  MAINNET = 1,
  GOERLI = 5,
  GNOSIS = 100,
}

export const unitapPassSupportedNetworks = [
  {
    name: "Bitcoin",
    icon: "btc.svg",
    address: "bc1qpcn3ztcgltws9ced8ktmn075dmqvj7dxu73fag",
    qr: "btc-address.png",
  },
  {
    name: "EVM Networks",
    icon: "eth.svg",
    address: "0xdB1F064C0b188a95b7801050474Da26fc95eb01E",
    qr: "ETH-address.png",
  },
  {
    name: "Solana",
    icon: "solana.svg",
    address: "pRogDW5qSapudKBgeD2oTSaKku4jNgn3FE7RXo1ojrb",
    qr: "solana-address.png",
  },
];

export const lightingChainId = "286621";
