import React, { createContext, PropsWithChildren, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { claimMax, getActiveClaimHistory, getChainList } from 'api';
import {
  BrightIdConnectionModalState,
  BrightIdModalState,
  BrightIdVerificationStatus,
  Chain,
  ChainType,
  ClaimBoxState,
  ClaimBoxStateContainer,
  ClaimReceipt,
  HaveBrightIdAccountModalState,
  Network,
} from 'types';
import { UserProfileContext } from './useUserProfile';
import { RefreshContext } from 'context/RefreshContext';
import getClaimBoxState from 'utils/hook/getClaimBoxState';
import getActiveClaimReciept from 'utils/hook/getActiveClaimReciept';
import removeRequest from 'utils/hook/claimRequests';
import { useWeb3React } from '@web3-react/core';
import { searchChainList, searchChainListSimple } from 'utils/hook/searchChainList';

export const ClaimContext = createContext<{
  chainList: Chain[];
  chainListSearchResult: Chain[];
  chainListSearchSimpleResult: Chain[];
  changeSearchPhrase: ((newSearchPhrase: string) => void) | null;
  claim: (chainPK: number) => void;
  activeClaimReceipt: ClaimReceipt | null;
  closeClaimModal: () => void;
  openClaimModal: (chain: Chain) => void;
  activeChain: Chain | null;
  claimBoxStatus: { status: ClaimBoxState; lastFailPk: number | null };
  retryClaim: () => void;
  openBrightIdModal: () => void;
  closeBrightIdModal: () => void;
  brightidModalStatus: BrightIdModalState;
  openHaveBrightIdAccountModal: () => void;
  closeHaveBrightIdAccountModal: () => void;
  haveBrightIdAccountModalStatus: HaveBrightIdAccountModalState;
  openBrightIdConnectionModal: () => void;
  closeBrightIdConnectionModal: () => void;
  brightIdConnectionModalStatus: BrightIdConnectionModalState;
  selectedNetwork: Network;
  selectedChainType: ChainType;
  setSelectedNetwork: (network: Network) => void;
  setSelectedChainType: (chainType: ChainType) => void;
}>({
  chainList: [],
  chainListSearchResult: [],
  chainListSearchSimpleResult: [],
  changeSearchPhrase: null,
  claim: (chainPK: number) => {},
  activeClaimReceipt: null,
  closeClaimModal: () => {},
  openClaimModal: (chain: Chain) => {},
  activeChain: null,
  claimBoxStatus: { status: ClaimBoxState.CLOSED, lastFailPk: null },
  retryClaim: () => {},
  openBrightIdModal: () => {},
  closeBrightIdModal: () => {},
  brightidModalStatus: BrightIdModalState.CLOSED,
  openHaveBrightIdAccountModal: () => {},
  closeHaveBrightIdAccountModal: () => {},
  haveBrightIdAccountModalStatus: HaveBrightIdAccountModalState.CLOSED,
  openBrightIdConnectionModal: () => {},
  closeBrightIdConnectionModal: () => {},
  brightIdConnectionModalStatus: BrightIdConnectionModalState.CLOSED,
  selectedNetwork: Network.MAINNET,
  selectedChainType: ChainType.EVM,
  setSelectedNetwork: (network: Network) => {},
  setSelectedChainType: (chainType: ChainType) => {},
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
  const [brightidModalStatus, setBrightidModalStatus] = useState<BrightIdModalState>(BrightIdModalState.CLOSED);
  const [haveBrightIdAccountModalStatus, setHaveBrightIdAccountModalStatus] = useState<HaveBrightIdAccountModalState>(HaveBrightIdAccountModalState.CLOSED);
  const [brightIdConnectionModalStatus, setBrightIdConnectionModalStatus] = useState<BrightIdConnectionModalState>(BrightIdConnectionModalState.CLOSED);

  const [activeChain, setActiveChain] = useState<Chain | null>(null);

  // list of chian.pk of requesting claims
  const [claimRequests, setClaimRequests] = useState<number[]>([]);

  const { account: address, account } = useWeb3React();
  const { userProfile } = useContext(UserProfileContext);
  const { fastRefresh } = useContext(RefreshContext);

  const brightIdVerified = useMemo(
    () => userProfile?.profile.is_meet_verified || false,
    [userProfile],
  );

  const updateChainList = useCallback(async () => {
    try {
      const newChainList = await getChainList();
      setChainList(newChainList);
    } catch (e) {}
  }, []);

  const updateActiveClaimHistory = useCallback(async () => {
    if (address) {
      try {
        const newClaimHistory = await getActiveClaimHistory(address);
        setActiveClaimHistory(newClaimHistory);
      } catch (e) {}
    }
  }, [address]);

  useEffect(() => {
    updateChainList();
    updateActiveClaimHistory();
  }, [fastRefresh, updateActiveClaimHistory, updateChainList]);

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
        getClaimBoxState(address, brightIdVerified, activeChain, activeClaimReceipt, claimBoxStatus, claimRequests),
      ),
    [address, brightIdVerified, activeClaimReceipt, activeChain, claimRequests, activeClaimHistory],
  );

  const claim = useCallback(
    //TODO: tell user about failing to communicate with server
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
  
  const [selectedNetwork, setSelectedNetwork] = React.useState(Network.MAINNET);
  const [selectedChainType, setSelectedChainType] = React.useState(ChainType.EVM);

  const chainListSearchResult = useMemo(
    () => searchChainList(searchPhrase, chainList, selectedNetwork, selectedChainType),
    [searchPhrase, chainList, selectedNetwork, selectedChainType],
  );
  
  const chainListSearchSimpleResult = useMemo(
    () => searchChainListSimple(searchPhrase, chainList),
    [searchPhrase, chainList],
  );

  const changeSearchPhrase = (newSearchPhrase: string) => {
    setSearchPhrase(newSearchPhrase);
  };

  const openBrightIdModal = () => {
    setBrightidModalStatus(BrightIdModalState.OPENED);
  };
  const closeBrightIdModal = () => {
    setBrightidModalStatus(BrightIdModalState.CLOSED);
  };

  const openHaveBrightIdAccountModal = () => {
    setHaveBrightIdAccountModalStatus(HaveBrightIdAccountModalState.OPENED);
  };
  const closeHaveBrightIdAccountModal = () => {
    setHaveBrightIdAccountModalStatus(HaveBrightIdAccountModalState.CLOSED);
  };
  
  const openBrightIdConnectionModal = () => {
    setBrightIdConnectionModalStatus(BrightIdConnectionModalState.OPENED);
  };
  const closeBrightIdConnectionModal = () => {
    setBrightIdConnectionModalStatus(BrightIdConnectionModalState.CLOSED);
  };


  return (
    <ClaimContext.Provider
      value={{
        chainList,
        chainListSearchResult,
        chainListSearchSimpleResult,
        changeSearchPhrase,
        claim,
        activeClaimReceipt,
        openClaimModal,
        closeClaimModal,
        activeChain,
        claimBoxStatus,
        retryClaim,
        openBrightIdModal,
        closeBrightIdModal,
        brightidModalStatus,
        openHaveBrightIdAccountModal,
        closeHaveBrightIdAccountModal,
        haveBrightIdAccountModalStatus,
        openBrightIdConnectionModal,
        closeBrightIdConnectionModal,
        brightIdConnectionModalStatus,
        selectedNetwork,
        setSelectedNetwork,
        selectedChainType,
        setSelectedChainType,
      }}
    >
      {children}
    </ClaimContext.Provider>
  );
}
