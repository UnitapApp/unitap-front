import React, { createContext, PropsWithChildren, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { claimMax, getChainList, getActiveClaimHistory } from 'api';
import { BrightIdVerificationStatus, Chain, ClaimReceipt, ClaimBoxState, ClaimBoxStateContainer } from 'types';
import { UserProfileContext } from './useUserProfile';
import useActiveWeb3React from './useActiveWeb3React';
import { RefreshContext } from 'context/RefreshContext';
import searchChainList from 'utils/hook/searchChainList';
import getClaimBoxState from 'utils/hook/getClaimBoxState';
import getActiveClaimReciept from 'utils/hook/getActiveClaimReciept';
import tryUntilSuccess from 'utils/hook/tryUntilSuccess';
import removeRequest from 'utils/hook/claimRequests';

export const ClaimContext = createContext<{
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

export function ClaimProvider({ children }: PropsWithChildren<{}>) {
  const [chainList, setChainList] = useState<Chain[]>([]);
  const [searchPhrase, setSearchPhrase] = useState<string>('');

  const [activeClaimHistory, setActiveClaimHistory] = useState<ClaimReceipt[]>([]);
  const [activeClaimReceipt, setActiveClaimReceipt] = useState<ClaimReceipt | null>(null);
  const [claimBoxStatus, setClaimBoxStatus] = useState<ClaimBoxStateContainer>({
    status: ClaimBoxState.CLOSED,
    lastFailPk: null,
  });

  const [activeChain, setActiveChain] = useState<Chain | null>(null);

  // list of chian.pk of requesting claims
  const [claimRequests, setClaimRequests] = useState<number[]>([]);

  const { account: address, account } = useActiveWeb3React();
  const { userProfile } = useContext(UserProfileContext);
  const { fastRefresh } = useContext(RefreshContext);

  const brightIdVerified = useMemo(
    () => userProfile?.verificationStatus === BrightIdVerificationStatus.VERIFIED,
    [userProfile],
  );

  const updateChainList = useCallback(async () => {
    const newChainList = await getChainList(userProfile ? address : null);
    setChainList(newChainList);
  }, [address, userProfile]);

  const updateActiveClaimHistory = useCallback(async () => {
    if (address) {
      const newClaimHistory = await getActiveClaimHistory(address);
      setActiveClaimHistory(newClaimHistory);
    }
  }, [address]);

  useEffect(() => tryUntilSuccess(updateChainList), [address, updateChainList, fastRefresh]);
  useEffect(() => tryUntilSuccess(updateActiveClaimHistory), [fastRefresh, updateActiveClaimHistory]);

  useEffect(() => {
    if (activeChain) {
      setActiveClaimReceipt(getActiveClaimReciept(activeClaimHistory, activeChain));
    }
  }, [activeChain, setActiveClaimReceipt, activeClaimHistory]);

  const openClaimModal = useCallback((chain: Chain) => {
    setActiveChain(chain);
  }, []);

  const closeClaimModal = useCallback(() => {
    setActiveChain(null);
  }, []);

  const retryClaim = useCallback(() => {
    if (activeClaimReceipt) setClaimBoxStatus({ status: ClaimBoxState.INITIAL, lastFailPk: activeClaimReceipt.pk });
  }, [activeClaimReceipt]);

  useEffect(
    () =>
      setClaimBoxStatus((claimBoxStatus) =>
        getClaimBoxState(activeChain, activeClaimReceipt, claimBoxStatus, claimRequests),
      ),
    [activeClaimReceipt, activeChain, claimRequests, activeClaimHistory],
  );

  const claim = useCallback(
    // to-do tell user about failing to communicate with server
    async (claimChainPk: number) => {
      if (!brightIdVerified || claimRequests.filter((chainPk) => chainPk === claimChainPk).length > 0) {
        return;
      }
      setClaimRequests((claimRequests) => [...claimRequests, claimChainPk]);
      try {
        await claimMax(account!, claimChainPk);
        await updateActiveClaimHistory();
        setClaimRequests((claimRequests) => removeRequest(claimRequests, claimChainPk));
      } catch (ex) {
        await updateActiveClaimHistory();
        setClaimRequests((claimRequests) => removeRequest(claimRequests, claimChainPk));
      }
    },
    [account, brightIdVerified, claimRequests, updateActiveClaimHistory],
  );

  const chainListSearchResult = useMemo(() => searchChainList(searchPhrase, chainList), [searchPhrase, chainList]);

  const changeSearchPhrase = (newSearchPhrase: string) => {
    setSearchPhrase(newSearchPhrase);
  };

  return (
    <ClaimContext.Provider
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
    </ClaimContext.Provider>
  );
}
