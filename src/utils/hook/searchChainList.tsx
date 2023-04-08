import { Chain, ChainType, Network } from 'types';
import Fuse from 'fuse.js';

const getSearchQueryResult = (searchPhrase: string, chainList: Chain[]) => {
  if (searchPhrase === '') return chainList;
  const fuseOptions = {
    // isCaseSensitive: false,
    // includeScore: false,
    // shouldSort: true,
    // includeMatches: false,
    // findAllMatches: false,
    // minMatchCharLength: 1,
    // location: 0,
    threshold: 0.2, // threshoud is between 0 and 1 where 0 is strict and 1 is accepting anything
    // distance: 100,
    // useExtendedSearch: false,
    // ignoreLocation: false,
    // ignoreFieldNorm: false,
    // fieldNormWeight: 1,
    keys: ['nativeCurrencyName', 'chainName'],
  };
  const fuse = new Fuse(chainList, fuseOptions);
  return fuse.search(searchPhrase).flatMap((serachResult) => serachResult.item);
};

const getNetworkFilterResult = (selectedNetwork: Network, chainList: Chain[]) => {
  if (selectedNetwork === Network.MAINNET) {
    chainList = chainList.filter((chain) => chain.isTestnet === false);
  } else if (selectedNetwork === Network.TESTNET) {
    chainList = chainList.filter((chain) => chain.isTestnet === true);
  }
  return chainList;
};

const getChainTypeFilterResult = (selectedChainType: ChainType, chainList: Chain[]) => {
  if (selectedChainType === ChainType.EVM) {
    chainList = chainList.filter((chain) => chain.chainType === ChainType.EVM);
  } else if (selectedChainType === ChainType.NONEVM) {
    chainList = chainList.filter((chain) => chain.chainType === ChainType.NONEVM || chain.chainType === ChainType.SOLANA || chain.chainType === ChainType.LIGHTNING);
  }
  return chainList;
};

export const searchChainListSimple = (
  searchPhrase: string,
  chainList: Chain[],
) => {
  let searchChainListResult = getSearchQueryResult(searchPhrase, chainList);
  return searchChainListResult;
};

export const searchChainList = (
  searchPhrase: string,
  chainList: Chain[],
  selectedNetwork: Network,
  selectedChainType: ChainType,
) => {
  if (searchPhrase !== '') return getSearchQueryResult(searchPhrase, chainList);

  let searchChainListResult = getNetworkFilterResult(selectedNetwork, chainList);
  searchChainListResult = getChainTypeFilterResult(selectedChainType, searchChainListResult);
  return searchChainListResult;
};

