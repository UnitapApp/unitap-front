import React, { createContext, PropsWithChildren, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { getChainList } from 'api';
import { Chain } from 'types';
import Fuse from 'fuse.js';
import { UserProfileContext } from './useUserProfile';
import useActiveWeb3React from './useActiveWeb3React';
import { RefreshContext } from 'context/RefreshContext';

enum ClaimState {
  INITIAL,
  LOADING,
  SUCCESS,
  FAILED,
}
export const ChainListContext = createContext<{
  chainList: Chain[];
  updateChainList: (() => Promise<void>) | null;
  chainListSearchResult: Chain[];
  changeSearchPhrase: ((newSearchPhrase: string) => void) | null;
  claimState : ClaimState;
  setClaimState : (newClaimState:ClaimState) => void;
}>({ chainList: [],
  updateChainList: null,
  chainListSearchResult: [],
  changeSearchPhrase: null,
  claimState: ClaimState.INITIAL,
  setClaimState : (newClaimState:ClaimState) => {},
});

export function ChainListProvider({ children }: PropsWithChildren<{}>) {

  const [claimState, setClaimStateFun] = useState<ClaimState>(ClaimState.INITIAL);
  const [chainList, setChainList] = useState<Chain[]>([]);
  const [searchPhrase, setSearchPhrase] = useState<string>('');
  const { account: address } = useActiveWeb3React();
  const { userProfile } = useContext(UserProfileContext);
  const { fastRefresh } = useContext(RefreshContext);
  const updateChainList = useCallback(async () => {
    const newChainList = await getChainList(
      // use address only if userprofile is loaded
      userProfile ? address : null,
    );
    setChainList(newChainList);
  }, [address, userProfile]);

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

  const setClaimState = (newClaimState: ClaimState) => setClaimStateFun(newClaimState);
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
    <ChainListContext.Provider
      value={{
        chainList,
        updateChainList,
        chainListSearchResult,
        changeSearchPhrase,
        claimState,
        setClaimState,
      }}
    >
      {children}{' '}
    </ChainListContext.Provider>
  );
}
