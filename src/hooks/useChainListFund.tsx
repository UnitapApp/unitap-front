import React, { createContext, PropsWithChildren, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { claimMax, getChainList, getActiveClaimHistory } from 'api';
import { BrightIdVerificationStatus, Chain, ClaimReceipt, ClaimReceiptState, ClaimBoxState } from 'types';
import Fuse from 'fuse.js';
import { UserProfileContext } from './useUserProfile';
import useActiveWeb3React from './useActiveWeb3React';
import { RefreshContext } from 'context/RefreshContext';

export const FundContext = createContext<{
  chainList: Chain[];
  chainListSearchResult: Chain[];
  changeSearchPhrase: ((newSearchPhrase: string) => void) | null;
}>({
  chainList: [],
  chainListSearchResult: [],
  changeSearchPhrase: null,
});

export function FundProvider({ children }: PropsWithChildren<{}>) {
  const [chainList, setChainList] = useState<Chain[]>([]);
  const [searchPhrase, setSearchPhrase] = useState<string>('');

  const { account: address } = useActiveWeb3React();
  const { fastRefresh } = useContext(RefreshContext);

  const updateChainList = useCallback(async () => {
    const newChainList = await getChainList(address ? address : null);
    setChainList(newChainList);
  }, [address]);

  useEffect(() => {
    const fn = async () => {
      try {
        await updateChainList();
      } catch (e) {
        fn();
      }
    };
    fn();
  }, [address, updateChainList, fastRefresh]);

  const chainListSearchResult = useMemo(() => {
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
  }, [searchPhrase, chainList]);

  const changeSearchPhrase = (newSearchPhrase: string) => {
    setSearchPhrase(newSearchPhrase);
  };

  return (
    <FundContext.Provider
      value={{
        chainList,
        chainListSearchResult,
        changeSearchPhrase,
      }}
    >
      {children}
    </FundContext.Provider>
  );
}
