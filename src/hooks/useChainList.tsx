import React, { createContext, PropsWithChildren, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { claimMax, getChainList, getActiveClaimHistory } from 'api';
import { BrightIdVerificationStatus, Chain, ClaimReceipt, ClaimReceiptState, ClaimBoxState } from 'types';
import Fuse from 'fuse.js';
import { UserProfileContext } from './useUserProfile';
import useActiveWeb3React from './useActiveWeb3React';
import { RefreshContext } from 'context/RefreshContext';

export const ChainListContext = createContext<{
  chainList: Chain[];
  chainListSearchResult: Chain[];
  changeSearchPhrase: ((newSearchPhrase: string) => void) | null;
  claim: (chainPK: number) => void;
  activeClaimReceipt: ClaimReceipt | null;
  closeClaimModal: () => void;
  openClaimModal: (chain: Chain) => void;
  activeChain: Chain | null;
  claimBoxStatus: { status: ClaimBoxState; lastFailPk: number | null };
  retryClaim: () => void;
}>({
  chainList: [],
  chainListSearchResult: [],
  changeSearchPhrase: null,
  claim: (chainPK: number) => {},
  activeClaimReceipt: null,
  closeClaimModal: () => {},
  openClaimModal: (chain: Chain) => {},
  activeChain: null,
  claimBoxStatus: { status: ClaimBoxState.CLOSED, lastFailPk: null },
  retryClaim: () => {},
});

export function ChainListProvider({ children }: PropsWithChildren<{}>) {
  const [chainList, setChainList] = useState<Chain[]>([]);
  const [searchPhrase, setSearchPhrase] = useState<string>('');

  const [activeClaimHistory, setActiveClaimHistory] = useState<ClaimReceipt[]>([]);
  const [activeClaimReceipt, setActiveClaimReceipt] = useState<ClaimReceipt | null>(null);
  const [claimBoxStatus, setClaimBoxStatus] = useState<{ status: ClaimBoxState; lastFailPk: number | null }>({
    status: ClaimBoxState.CLOSED,
    lastFailPk: null,
  });

  const [activeChain, setActiveChain] = useState<Chain | null>(null);

  // list of chian.pk of requesting claims
  const [claimRequest, setClaimRequest] = useState<number[]>([]);

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
    if (!activeChain) return null;
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

    if (verified.length > 0) return verified[0];
    if (pending.length > 0) return pending[0];
    if (rejected.length > 0) return rejected[0];

    return null;
  }, []);

  useEffect(() => {
    if (activeChain) {
      setActiveClaimReceipt(getActiveClaimReciept(activeClaimHistory, activeChain));
    }
  }, [activeChain, setActiveClaimReceipt, activeClaimHistory, getActiveClaimReciept]);

  const openClaimModal = useCallback(
    (chain: Chain) => {
      setActiveChain(chain);
      setClaimBoxStatus({ status: ClaimBoxState.INITIAL, lastFailPk: null });
    },
    [setActiveChain, setClaimBoxStatus],
  );

  const closeClaimModal = useCallback(() => {
    setActiveChain(null);
    setClaimBoxStatus({ status: ClaimBoxState.CLOSED, lastFailPk: null });
  }, [setActiveChain, setClaimBoxStatus]);

  const retryClaim = useCallback(() => {
    if (activeClaimReceipt) setClaimBoxStatus({ status: ClaimBoxState.INITIAL, lastFailPk: activeClaimReceipt.pk });
  }, [activeClaimReceipt, setClaimBoxStatus]);

  useEffect(() => {
    setClaimBoxStatus((claimBoxStatus) => {
      //closed claim box
      if (!activeChain) return { status: ClaimBoxState.CLOSED, lastFailPk: null };

      // verified
      if (activeClaimReceipt && activeClaimReceipt.status === ClaimReceiptState.VERIFIED)
        return { status: ClaimBoxState.VERIFIED, lastFailPk: null };

      //pending
      if (activeClaimReceipt && activeClaimReceipt.status === ClaimReceiptState.PENDING)
        return { status: ClaimBoxState.PENDING, lastFailPk: claimBoxStatus.lastFailPk };

      //request
      if (claimRequest.filter((chainPk) => chainPk === activeChain.pk).length >= 1) {
        return { status: ClaimBoxState.REQUEST, lastFailPk: claimBoxStatus.lastFailPk };
      }

      //initial | initial after fail
      if (
        !activeClaimReceipt ||
        (activeClaimReceipt.status === ClaimReceiptState.REJECTED &&
          activeClaimReceipt.pk === claimBoxStatus.lastFailPk)
      )
        return { status: ClaimBoxState.INITIAL, lastFailPk: claimBoxStatus.lastFailPk };

      //fail rejected
      if (
        activeClaimReceipt &&
        activeClaimReceipt.status === ClaimReceiptState.REJECTED &&
        activeClaimReceipt.pk !== claimBoxStatus.lastFailPk
      )
        return { status: ClaimBoxState.REJECTED, lastFailPk: claimBoxStatus.lastFailPk };

      return claimBoxStatus;
    });
  }, [activeClaimReceipt, setClaimBoxStatus, activeChain, claimRequest, activeClaimHistory]);

  const claim = useCallback(
    // to-do request state is better to use only claim state
    // to-do tell user about failing to communicate with server
    async (claimChainPk: number) => {
      if (!brightIdVerified || claimRequest.filter((chainPk) => chainPk === claimChainPk).length > 0) {
        return;
      }
      // rename to better name
      setClaimRequest((claimRequest) => [...claimRequest, claimChainPk]);
      try {
        await claimMax(account!, claimChainPk);

        await updateActiveClaimHistory();

        setClaimRequest((claimRequest) => claimRequest.filter((chainPk) => chainPk !== claimChainPk));
      } catch (ex) {
        await updateActiveClaimHistory();
        setClaimRequest((claimRequest) => claimRequest.filter((chainPk) => chainPk !== claimChainPk));
      }
    },
    [account, brightIdVerified, setClaimRequest, claimRequest, updateActiveClaimHistory],
  );

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
        claim,
        activeClaimReceipt,
        openClaimModal,
        closeClaimModal,
        activeChain,
        claimBoxStatus,
        retryClaim,
      }}
    >
      {children}
    </ChainListContext.Provider>
  );
}
