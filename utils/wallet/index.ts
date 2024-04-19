"use client";

import { Chain, ChainType } from "@/types";
import { Address, Client, PublicClient } from "viem";
import { switchChain } from "viem/actions";
import {
  useAccount,
  useBalance,
  useConnect,
  useDisconnect,
  usePublicClient,
  useWalletClient,
  useEstimateGas,
} from "wagmi";

export const useWalletAccount = () => {
  return useAccount();
};

export const useWalletNetwork = () => {
  return useAccount();
};

export const useNetworkSwitcher = () => {
  const { connector, chain } = useAccount();

  const client = useProvider();

  const addAndSwitchChain = (chain: Chain) => {
    // addChain(client, {
    //   chain: {
    //     id: Number(chain.chainId),
    //     name: chain.chainName,
    //     nativeCurrency: {
    //       decimals: chain.decimals,
    //       name: chain.nativeCurrencyName,
    //       symbol: chain.symbol,
    //     },
    //     blockExplorers: {
    //       etherscan: {
    //         name: "eth",
    //         url: chain.explorerUrl,
    //       },
    //       default: {
    //         name: "eth",
    //         url: chain.explorerUrl,
    //       },
    //     },
    //     rpcUrls: {
    //       default: { http: [chain.rpcUrl] },
    //       public: { http: [chain.rpcUrl] },
    //     },
    //   },
    // });
    if (!client) return;

    switchChain(client, { id: Number(chain.chainId) });
  };

  return {
    selectedNetwork: chain,
    switchChain: (chainId: number) => connector?.switchChain?.({ chainId }),
    addAndSwitchChain,
  };
};

export const useAccountBalance = (account?: string, chainId?: number) =>
  useBalance({
    address: account as `0x{string}`,
    chainId,
  });

export const useProvider: () => Client | undefined = () => {
  const { isConnected } = useWalletAccount();

  const walletProvider = useWalletClient();
  const publicProvider = usePublicClient();

  return isConnected ? walletProvider.data : publicProvider;
};

export const useWeb3 = () => {
  const provider = useProvider();

  const network = useWalletNetwork();

  const account = useWalletAccount();

  return {
    address: account.address,
    isConnected: account.isConnected,
    chainId: network.chain?.id,
    chain: network.chain,
    provider,
  };
};

export class WalletProvider {
  constructor(private provider: Client) {}
}

export const useUserWalletProvider = () => {
  const network = useWalletNetwork();

  const account = useWalletAccount();

  const walletProvider = useWalletClient();

  return {
    connection: {
      isConnected: account.isConnected,
      isConnecting: account.isConnecting,
      address: account.address,
    },
    network: {
      chain: network.chain,
      chainId: network.chain?.id,
    },

    signer: {
      isAvailable: walletProvider.isSuccess,
      result: walletProvider.data,
    },
  };
};

export const useWalletConnection = () => {
  const { connect, isPending, connectors, isSuccess } = useConnect();

  const { disconnect, isPending: isDisconnectLoading } = useDisconnect();

  return {
    connect,
    isLoading: isPending,
    connectors,
    isSuccess,
    disconnect,
    isDisconnectLoading,
  };
};

export type EstimateGasProps = {
  from: string;
  to: string;
  value?: bigint;
  data?: string;
};

export const useEstimateContractGas = ({
  to,
  amount,
  chainId,
}: {
  to: Address;
  amount: bigint;
  chainId?: number;
}) =>
  useEstimateGas({
    to,
    value: amount,
    chainId,
  });

// export const estimateGas = (
//   provider: Client,
//   { from, to, value, data }: EstimateGasProps
// ) => {
//   return estimateGas({
//     account: from as Address,
//     to: to as Address,
//     value,
//     data: data as Address,
//   });
// };

export const callProvider = (
  provider: PublicClient,
  { from, to, value, data }: EstimateGasProps,
) => {
  return provider.call({
    account: from as `0x{string}`,
    to: to as `0x{string}`,
    value,
    data: data as `0x{string}`,
  });
};

export const useWalletSigner = () => {
  return useWalletClient().data;
};

export const useWalletBalance = ({
  address,
  chainId,
}: {
  address: any;
  chainId: number | undefined;
}) => {
  return useBalance({ address, chainId });
};

export const useWalletProvider = (props?: { chainId?: number }) => {
  return usePublicClient(props);
};

export default function getCorrectAddress(chain: Chain, address: string) {
  if (chain.chainName === "XDC" && chain.chainType === ChainType.NONEVMXDC) {
    if (
      address.slice(0, 2) !== "0x" ||
      (address.slice(0, 2) !== "0X" &&
        (address.slice(0, 3) === "xdc" || address.slice(0, 3) === "XDC"))
    ) {
      return "0x" + address.slice(3, address.length);
    }
  }
  return address;
}
