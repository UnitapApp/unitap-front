"use client";

import { useGasTapContext } from "@/context/gasTapProvider";
import { ChainType, Network, Token } from "@/types";
import { FC } from "react";

const TokenTapNetworkFilter: FC<{
  label: string;
  selectedChainType: string;
  onChange: (value: ChainType) => void;
  chainType: ChainType;
}> = ({ selectedChainType, label, onChange, chainType }) => {
  return (
    <div
      className={`relative w-full cursor-pointer rounded-md border border-bg01 px-1 py-3 text-center text-xs sm:w-[72px] ${
        selectedChainType === chainType
          ? `gastap-filter-gradient text-whit gastap-filter-active`
          : `text-txt2`
      }`}
      data-testid={`chains-filter-chain-type-${label}`}
      onClick={() => {
        onChange(chainType);
      }}
    >
      {label}
    </div>
  );
};

const GasTapNetworkFilter: FC<{
  label: string;
  selectedNetwork: string;
  onChange: (value: Network) => void;
  network: Network;
}> = ({ selectedNetwork, label, onChange, network }) => {
  return (
    <div
      className={`relative w-full cursor-pointer rounded-md border border-bg01 px-1 py-3 text-center text-xs sm:w-[72px] ${
        selectedNetwork === network
          ? `gastap-filter-gradient text-whit gastap-filter-active`
          : `text-txt2`
      }`}
      data-testid={`chains-filter-chain-type-${label}`}
      onClick={() => {
        onChange(network);
      }}
    >
      {label}
    </div>
  );
};

export const Filters = () => {
  const {
    selectedNetwork,
    setSelectedNetwork,
    selectedChainType,
    setSelectedChainType,
  } = useGasTapContext();

  return (
    <div className="mb-2 flex w-full flex-col items-center justify-between gap-2 sm:w-auto sm:flex-row sm:gap-0 md:mb-0 md:ml-auto md:justify-end">
      <div className="flex w-full items-center gap-[2px] rounded-lg border-2  border-bg01 bg-bg02 sm:w-auto">
        <TokenTapNetworkFilter
          chainType={ChainType.ALL}
          label="ALL"
          onChange={setSelectedChainType}
          selectedChainType={selectedChainType}
        />
        <TokenTapNetworkFilter
          chainType={ChainType.EVM}
          label="EVM"
          onChange={setSelectedChainType}
          selectedChainType={selectedChainType}
        />
        <TokenTapNetworkFilter
          chainType={ChainType.NONEVM}
          label="nonEVM"
          onChange={setSelectedChainType}
          selectedChainType={selectedChainType}
        />
      </div>
      <div className="switch flex w-full items-center gap-[2px] rounded-lg border-2 border-bg01 bg-bg02 sm:ml-3 sm:w-auto">
        <GasTapNetworkFilter
          selectedNetwork={selectedNetwork}
          label="ALL"
          network={Network.ALL}
          onChange={setSelectedNetwork}
        />
        <GasTapNetworkFilter
          selectedNetwork={selectedNetwork}
          label="Mainnets"
          network={Network.MAINNET}
          onChange={setSelectedNetwork}
        />
        <GasTapNetworkFilter
          selectedNetwork={selectedNetwork}
          label="Testnets"
          network={Network.TESTNET}
          onChange={setSelectedNetwork}
        />
      </div>
    </div>
  );
};

export default Filters;
