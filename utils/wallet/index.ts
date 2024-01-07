"use client";

import { Chain, ChainType } from "@/types";
import { useCallback, useEffect, useState } from "react";
import { Client } from "viem";
import {
  PublicClient,
  useAccount,
  useBalance,
  useConnect,
  useDisconnect,
  useNetwork,
  usePublicClient,
  useWalletClient,
} from "wagmi";
import { ConnectArgs, GetWalletClientResult } from "wagmi/actions";

export const useWalletAccount = () => {
  return useAccount();
};

export const useWalletNetwork = () => {
  return useNetwork();
};

export const useNetworkSwitcher = () => {
  const { chain } = useNetwork();
  const { connector } = useAccount();

  const signer = useWalletSigner();

  const [provider, setProvider] = useState<Client | undefined>(undefined);

  const addAndSwitchChain = (chain: Chain) => {
    signer?.addChain?.({
      chain: {
        id: Number(chain.chainId),
        name: chain.chainName,
        nativeCurrency: {
          decimals: chain.decimals,
          name: chain.nativeCurrencyName,
          symbol: chain.symbol,
        },
        network: chain.chainName,
        blockExplorers: {
          etherscan: {
            name: "eth",
            url: chain.explorerUrl,
          },
          default: {
            name: "eth",
            url: chain.explorerUrl,
          },
        },
        rpcUrls: {
          default: { http: [chain.rpcUrl] },
          public: { http: [chain.rpcUrl] },
        },
      },
    });
  };

  useEffect(() => {
    if (!connector) return;

    connector.getWalletClient().then((provider) => {
      setProvider(provider);
    });
  }, [connector]);

  return {
    selectedNetwork: chain,
    switchChain: (chainId: number) => connector?.switchChain?.(chainId),
    addAndSwitchChain,
  };
};

export const useAccountBalance = (account?: string, chainId?: number) =>
  useBalance({
    address: account as `0x{string}`,
    chainId,
  });

export const useProvider: () =>
  | PublicClient
  | GetWalletClientResult
  | undefined = () => {
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
  constructor(private provider: PublicClient) {}
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
  const { connect, isLoading, connectors, isSuccess } = useConnect();

  const { disconnect, isLoading: isDisconnectLoading } = useDisconnect();

  const onConnect = async (args?: Partial<ConnectArgs> | undefined) => {
    if (
      (args?.connector?.id === "injected" ||
        args?.connector?.id === "metamask") &&
      (window as any).ethereum.selectedAddress
    ) {
      await (window as any).ethereum.request({
        method: "eth_requestAccounts",
        params: [
          {
            eth_accounts: {},
          },
        ],
      });
      await (window as any).ethereum.request({
        method: "wallet_requestPermissions",
        params: [
          {
            eth_accounts: {},
          },
        ],
      });
    }

    connect(args);
  };

  return {
    connect: onConnect,
    isLoading,
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

export const estimateGas = (
  provider: PublicClient,
  { from, to, value, data }: EstimateGasProps
) => {
  return provider.estimateGas({
    account: from as `0x{string}`,
    to: to as `0x{string}`,
    value,
    data: data as `0x{string}`,
  });
};

export const callProvider = (
  provider: PublicClient,
  { from, to, value, data }: EstimateGasProps
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
