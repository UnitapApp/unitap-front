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
  arbitrum,
  telos,
  harmonyOne,
  celo,
  opBNBTestnet,
  linea,
  lineaTestnet,
  arbitrumNova,
  scrollSepolia,
  Chain,
  opBNB,
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
};

export const kccMainnet = {
  id: 321,
  network: "kcc-mainnet",
  name: "KuCoin Community Chain",
  nativeCurrency: { name: "KuCoin Token", symbol: "KCS", decimals: 18 },
  rpcUrls: {
    bscscan: {
      http: ["https://rpc-mainnet.kcc.network"],
      webSocket: ["wss://rpc-mainnet.kcc.network"],
    },
    kccscan: {
      http: ["https://explorer.kcc.io/en/rpc"],
      webSocket: ["wss://explorer.kcc.io/en/rpc"],
    },
    default: {
      http: ["https://rpc-mainnet.kcc.network"],
    },
    public: {
      http: ["https://rpc-mainnet.kcc.network"],
    },
  },
  blockExplorers: {
    default: {
      name: "KCCScan",
      url: "https://explorer.kcc.io/en",
    },
  },
  // contracts: {
  //   kccRegistrar: {
  //     address: "0x0000000000000000000000000000000000000000",
  //   },
  //   kccResolver: {
  //     address: "0x0000000000000000000000000000000000000000",
  //     blockCreated: 0, // Replace with the actual block number when deployed
  //   },
  //   multicall: {
  //     address: "0x0000000000000000000000000000000000000000",
  //     blockCreated: 0, // Replace with the actual block number when deployed
  //   },
  // },
} satisfies Chain;

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
  arbitrum,
  telos,
  harmonyOne,
  celo,
  opBNBTestnet,
  linea,
  lineaTestnet,
  arbitrumNova,
  scrollSepolia,
  kccMainnet,
  opBNB,
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
