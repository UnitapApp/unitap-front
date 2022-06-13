import React, { createContext, PropsWithChildren, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { claimMax, getChainList } from 'api';
import { BrightIdVerificationStatus, Chain, ClaimReceipt } from 'types';
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
  chainListSearchResult: Chain[];
  changeSearchPhrase: ((newSearchPhrase: string) => void) | null;
  claimState: ClaimState;
  claim: (chainPK: number) => void;
}>({
  chainList: [],
  chainListSearchResult: [],
  changeSearchPhrase: null,
  claimState: ClaimState.INITIAL,
  claim: (chainPK: number) => {},
});

export function ChainListProvider({ children }: PropsWithChildren<{}>) {
  const [claimState, setClaimState] = useState<ClaimState>(ClaimState.INITIAL);

  const [chainList, setChainList] = useState<Chain[]>([]);
  const [searchPhrase, setSearchPhrase] = useState<string>('');
  const { account: address, account } = useActiveWeb3React();
  const { userProfile } = useContext(UserProfileContext);
  const { fastRefresh } = useContext(RefreshContext);

  const brightIdVerified = useMemo(
    () => userProfile?.verificationStatus === BrightIdVerificationStatus.VERIFIED,
    [userProfile],
  );

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [claimReceipt, setClaimReceipt] = useState<ClaimReceipt | null>(null);

  const updateChainList = useCallback(async () => {
    const newChainList = await getChainList(
      // use address only if userprofile is loaded
      userProfile ? address : null,
    );
    setChainList(newChainList);
  }, [address, userProfile]);

  const claim = useCallback(
    async (chainPk: number) => {
      if (!brightIdVerified || claimState === ClaimState.LOADING) {
        return;
      }
      setClaimState(ClaimState.LOADING);
      try {
        const newClaimReceipt = await claimMax(account!, chainPk);
        setClaimReceipt(newClaimReceipt);
        await updateChainList?.();
        setClaimState(ClaimState.SUCCESS);
      } catch (ex) {
        setClaimState(ClaimState.FAILED);
      }
    },
    [account, brightIdVerified, claimState, updateChainList, setClaimState],
  );

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
    <ChainListContext.Provider
      value={{
        chainList,
        //updateChainList,
        chainListSearchResult,
        changeSearchPhrase,
        claimState,
        claim,
      }}
    >
      {children}{' '}
    </ChainListContext.Provider>
  );
}
