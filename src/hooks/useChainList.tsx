import React, { createContext, PropsWithChildren, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { claimMax, getChainList, getActiveClaimHistory } from 'api';
import { BrightIdVerificationStatus, Chain, ClaimReceipt, ClaimReceiptState } from 'types';
import Fuse from 'fuse.js';
import { UserProfileContext } from './useUserProfile';
import useActiveWeb3React from './useActiveWeb3React';
import { RefreshContext } from 'context/RefreshContext';
import { ignoreNextOnError } from '@sentry/browser/types/helpers';

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
  activeClaimReceipt: ClaimReceipt | null;
  closeClaimModal: () => void;
  openClaimModal: (chain: Chain) => void;
  activeChain: Chain | null;
}>({
  chainList: [],
  chainListSearchResult: [],
  changeSearchPhrase: null,
  claimState: ClaimState.INITIAL,
  claim: (chainPK: number) => {},
  activeClaimReceipt: null,
  closeClaimModal: () => {},
  openClaimModal: (chain: Chain) => {},
  activeChain: null,
});

export function ChainListProvider({ children }: PropsWithChildren<{}>) {
  const [claimState, setClaimState] = useState<ClaimState>(ClaimState.INITIAL);
  const [chainList, setChainList] = useState<Chain[]>([]);
  const [searchPhrase, setSearchPhrase] = useState<string>('');

  const [activeClaimHistory, setActiveClaimHistory] = useState<ClaimReceipt[]>([]);
  const [activeClaimReceipt, setActiveClaimReceipt] = useState<ClaimReceipt | null>(null);

  const [activeChain, setActiveChain] = useState<Chain | null>(null);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [claimReceipt, setClaimReceipt] = useState<ClaimReceipt | null>(null);

  const { account: address, account } = useActiveWeb3React();
  const { userProfile } = useContext(UserProfileContext);
  const { fastRefresh } = useContext(RefreshContext);

  const brightIdVerified = useMemo(
    () => userProfile?.verificationStatus === BrightIdVerificationStatus.VERIFIED,
    [userProfile],
  );

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

  const updateActiveClaimHistory = useCallback(async () => {
    if (address) {
      const newClaimHistory = await getActiveClaimHistory(address);
      setActiveClaimHistory(newClaimHistory);
    }
  }, [address, setActiveClaimHistory]);

  useEffect(() => {
    const fn = async () => {
      try {
        await updateActiveClaimHistory();
      } catch (e) {
        fn();
      }
    };
    fn();
  }, [fastRefresh, updateActiveClaimHistory]);

  const getActiveClaimReciept = useCallback((activeClaimHistory: ClaimReceipt[], activeChain: Chain | null) => {
    if (activeChain === null) return null;
    const verified = activeClaimHistory.filter(
      (claimReceipt: ClaimReceipt) =>
        claimReceipt.status === ClaimReceiptState.VERIFIED && claimReceipt.chain === activeChain.pk,
    );
    const rejected = activeClaimHistory.filter(
      (claimReceipt: ClaimReceipt) =>
        claimReceipt.status === ClaimReceiptState.REJECTED && claimReceipt.chain === activeChain.pk,
    );
    const pending = activeClaimHistory.filter(
      (claimReceipt: ClaimReceipt) =>
        claimReceipt.status === ClaimReceiptState.PENDING && claimReceipt.chain === activeChain.pk,
    );

    if (verified) return verified[0];
    if (pending) return pending[0];
    if (rejected) return rejected[0];

    return null;
  }, []);

  useEffect(() => {
    const fn = () => {
      if (activeChain) setActiveClaimReceipt(getActiveClaimReciept(activeClaimHistory, activeChain));
    };
    fn();
  }, [activeChain, setActiveClaimReceipt, activeClaimHistory, getActiveClaimReciept]);

  const openClaimModal = useCallback(
    (chain: Chain) => {
      setActiveChain(chain);
    },
    [setActiveChain],
  );

  const closeClaimModal = useCallback(() => {
    setActiveChain(null);
  }, [setActiveChain]);

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
        chainListSearchResult,
        changeSearchPhrase,
        claimState,
        claim,
        activeClaimReceipt,
        openClaimModal,
        closeClaimModal,
        activeChain,
      }}
    >
      {children}
    </ChainListContext.Provider>
  );
}
