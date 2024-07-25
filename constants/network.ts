import { SupportedChainId } from "./chains";

export const RPC_URLS: { [key: string]: string } = {
  [SupportedChainId.MAINNET]:
    "https://mainnet.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161",
  [SupportedChainId.GOERLI]:
    "https://goerli.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161",
  [SupportedChainId.GNOSIS]: "https://rpc.gnosischain.com",
};

export const RPC_URLS_WEBSOCKET: { [key: string]: string } = {
  [SupportedChainId.MAINNET]:
    "wss://mainnet.infura.io/ws/v3/9aa3d95b3bc440fa88ea12eaa4456161", // WebSocket URL for Mainnet
  [SupportedChainId.GOERLI]:
    "wss://goerli.infura.io/ws/v3/9aa3d95b3bc440fa88ea12eaa4456161", // WebSocket URL for Goerli
  [SupportedChainId.GNOSIS]: "wss://rpc.gnosischain.com", // WebSocket URL for Gnosis chain
};
