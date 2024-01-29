"use client";

import {
  configureChains,
  createConfig,
  Chain,
  Connector,
  mainnet,
} from "wagmi";
import { publicProvider } from "wagmi/providers/public";
import { InjectedConnector } from "wagmi/connectors/injected";
import { WalletConnectConnector } from "wagmi/connectors/walletConnect";
import { jsonRpcProvider } from "wagmi/providers/jsonRpc";
import { RPC_URLS, RPC_URLS_WEBSOCKET } from "@/constants/network";
import { SupportedChainId, supportedChains } from "@/constants/chains";
import { MockConnector } from "wagmi/connectors/mock";
import { createWalletClient, http, publicActions } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { TEST_PRIVATE_KEY } from "@/cypress/utils/data";

export const wagmiPublicProvider = publicProvider();

export const wagmiJsonRpcProvider = jsonRpcProvider({
  rpc: (chain: Chain) => ({
    http: RPC_URLS[chain.id as SupportedChainId],
    webSocket: RPC_URLS_WEBSOCKET[chain.id as SupportedChainId],
  }),
});

const { chains, publicClient, webSocketPublicClient } = configureChains(
  supportedChains,
  [wagmiPublicProvider, wagmiJsonRpcProvider] as any[]
);

const getConnectorProviders = (): Connector[] => {
  if (process.env.NEXT_PUBLIC_IS_TESTING === "1") {
    console.warn(
      "[TEST ENVIRONMENT] This is a testing environment and should not be used in production"
    );

    const account = privateKeyToAccount(TEST_PRIVATE_KEY);
    const connectors = [
      new MockConnector({
        chains,
        options: {
          chainId: mainnet.id,
          flags: {
            isAuthorized: true,
          },

          walletClient: createWalletClient({
            transport: http(mainnet.rpcUrls.default.http[0]),
            chain: mainnet,
            account,
          }).extend(publicActions),
        },
      }),
    ];

    return connectors;
  }

  return [
    new InjectedConnector({
      chains,
      options: {
        shimDisconnect: true,
      },
    }),
    new WalletConnectConnector({
      chains,
      options: {
        projectId: "31516b299852311acdc936c61cd7892c",
      },
    }),
  ];
};

export { publicClient, webSocketPublicClient };

export const config = createConfig({
  autoConnect: true,
  publicClient,
  webSocketPublicClient,
  connectors: getConnectorProviders(),
});
