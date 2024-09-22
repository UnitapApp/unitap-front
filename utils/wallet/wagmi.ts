import { cookieStorage, createConfig, createStorage, http } from "wagmi";
import { supportedChains } from "@/constants/chains";
import { injected, mock, safe, walletConnect } from "wagmi/connectors";

import { HttpTransport } from "viem";

const getConnectorProviders = () => {
  // if (process.env.NEXT_PUBLIC_IS_TESTING === "1") {
  //   // const account = privateKeyToAccount(TEST_PRIVATE_KEY);
  //   const connectors = [
  //     mock({
  //       accounts: [TEST_PRIVATE_KEY],
  //     }),
  //   ];

  //   return connectors;
  // }

  return [
    injected({
      shimDisconnect: true,
    }),
    walletConnect({
      projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID!,
    }),
    safe(),
  ];
};

const transports: { [key: string]: HttpTransport } = {};

for (const chain of supportedChains) {
  transports[chain.id] = http();
}

export const config = createConfig({
  ssr: true,
  storage: createStorage({
    storage: cookieStorage,
  }),
  chains: supportedChains as any,
  connectors: getConnectorProviders(),
  transports,
  multiInjectedProviderDiscovery: true,
});
