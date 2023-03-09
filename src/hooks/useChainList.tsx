import React, { createContext, PropsWithChildren, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { claimMax, getActiveClaimHistory, getChainList, claimMaxNonEVMAPI } from 'api';
import {
  BrightIdConnectionModalState,
  BrightIdModalState,
  BrightIdVerificationStatus,
  Chain,
  ChainType,
  ClaimBoxState,
  ClaimBoxStateContainer,
  ClaimNonEVMModalState,
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
import useToken from './useToken';

export const ClaimContext = createContext<{
  chainList: Chain[];
  chainListSearchResult: Chain[];
  chainListSearchSimpleResult: Chain[];
  changeSearchPhrase: ((newSearchPhrase: string) => void) | null;
  claim: (chainPK: number) => void;
  claimNonEVM: (chainPK: number, address: string) => void;
  activeClaimReceipt: ClaimReceipt | null;
  closeClaimModal: () => void;
  openClaimModal: (chain: Chain) => void;
  activeChain: Chain | null;
  activeNonEVMChain: Chain | null;
  claimBoxStatus: { status: ClaimBoxState; lastFailPk: number | null };
  retryClaim: () => void;
  openBrightIdModal: () => void;
  closeBrightIdModal: () => void;
  openClaimNonEVMModal: () => void;
  closeClaimNonEVMModal: () => void;
  brightidModalStatus: BrightIdModalState;
  claimNonEVMModalStatus: ClaimNonEVMModalState;
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
  claimNonEVM: (chainPK: number, address: string) => {},
  activeClaimReceipt: null,
  closeClaimModal: () => {},
  openClaimModal: (chain: Chain) => {},
  activeChain: null,
  activeNonEVMChain: null,
  claimBoxStatus: { status: ClaimBoxState.CLOSED, lastFailPk: null },
  retryClaim: () => {},
  openBrightIdModal: () => {},
  closeBrightIdModal: () => {},
  openClaimNonEVMModal: () => {},
  closeClaimNonEVMModal: () => {},
  brightidModalStatus: BrightIdModalState.CLOSED,
  claimNonEVMModalStatus: ClaimNonEVMModalState.CLOSED,
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
  const [claimNonEVMModalStatus, setClaimNonEVMModalStatus] = useState<ClaimNonEVMModalState>(ClaimNonEVMModalState.CLOSED);
  const [haveBrightIdAccountModalStatus, setHaveBrightIdAccountModalStatus] = useState<HaveBrightIdAccountModalState>(HaveBrightIdAccountModalState.CLOSED);
  const [brightIdConnectionModalStatus, setBrightIdConnectionModalStatus] = useState<BrightIdConnectionModalState>(BrightIdConnectionModalState.CLOSED);

  const [activeChain,
     setActiveChain]
   = useState<Chain | null>(null);
  const [activeNonEVMChain, setActiveNonEVMChain] = useState<Chain | null>(null);

  // list of chian.pk of requesting claims
  const [claimRequests, setClaimRequests] = useState<number[]>([]);

  const { account: address } = useWeb3React();
  const [ userToken, setToken ] = useToken();
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
    if (address && userToken) {
      try {
        const newClaimHistory = await getActiveClaimHistory(userToken, address);
        setActiveClaimHistory(newClaimHistory);
      } catch (e) {}
    }
  }, [address, userToken]);

  useEffect(() => {
    updateChainList();
    updateActiveClaimHistory();
  }, [fastRefresh, updateActiveClaimHistory, updateChainList]);

  useEffect(() => {
    if (activeChain)
     {
      setActiveClaimReceipt(getActiveClaimReciept(activeClaimHistory, activeChain)
      );
    }
  }, [activeChain,
     setActiveClaimReceipt, activeClaimHistory]);

  const openClaimModal = useCallback((chain: Chain) => {
    
    if (chain.chainType === ChainType.EVM) {
      setActiveChain(chain);
    } else if (chain.chainType === ChainType.NONEVM) {
      setActiveNonEVMChain(chain);
      setClaimNonEVMModalStatus(ClaimNonEVMModalState.OPENED);
    }
  }, []);

  const closeClaimModal = useCallback(() => {
    setActiveChain(
      null);
  }, []);

  const retryClaim = useCallback(() => {
    if (activeClaimReceipt) setClaimBoxStatus({ status: ClaimBoxState.INITIAL, lastFailPk: activeClaimReceipt.pk });
  }, [activeClaimReceipt]);

  useEffect(
    () =>
      setClaimBoxStatus((claimBoxStatus) =>
        getClaimBoxState(address, userProfile, activeChain,
           activeClaimReceipt, claimBoxStatus, claimRequests),
      ),
    [address, userProfile, activeClaimReceipt, activeChain,
       claimRequests, activeClaimHistory],
  );

  const claim = useCallback(
    //TODO: tell user about failing to communicate with server
    async (claimChainPk: number) => {
      if (!userToken || claimRequests.filter((chainPk) => chainPk === claimChainPk).length > 0) {
        return;
      }
      setClaimRequests((claimRequests) => [...claimRequests, claimChainPk]);
      try {
        await claimMax(userToken, claimChainPk);
        await updateActiveClaimHistory();
        setClaimRequests((claimRequests) => removeRequest(claimRequests, claimChainPk));
      } catch (ex) {
        await updateActiveClaimHistory();
        setClaimRequests((claimRequests) => removeRequest(claimRequests, claimChainPk));
      }
    },
    [userToken, claimRequests, updateActiveClaimHistory],
  );

  const claimNonEVM = useCallback(
    async (claimChainPk: number, address: string) => {
      if (!userToken || claimRequests.filter((chainPk) => chainPk === claimChainPk).length > 0) {
        return;
      }
      setClaimRequests((claimRequests) => [...claimRequests, claimChainPk]);
      try {
        await claimMaxNonEVMAPI(userToken, claimChainPk, address);
        await updateActiveClaimHistory();
        setClaimRequests((claimRequests) => removeRequest(claimRequests, claimChainPk));
      } catch (ex) {
        await updateActiveClaimHistory();
        setClaimRequests((claimRequests) => removeRequest(claimRequests, claimChainPk));
      }
    },
    [userToken, claimRequests, updateActiveClaimHistory],
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
  
  const openClaimNonEVMModal = () => {
    setClaimNonEVMModalStatus(ClaimNonEVMModalState.OPENED);
  };
  const closeClaimNonEVMModal = () => {
    setActiveNonEVMChain(null);
    setClaimNonEVMModalStatus(ClaimNonEVMModalState.CLOSED);
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
        claimNonEVM,
        activeClaimReceipt,
        openClaimModal,
        closeClaimModal,
        activeChain,
        activeNonEVMChain,
        claimBoxStatus,
        retryClaim,
        openBrightIdModal,
        closeBrightIdModal,
        openClaimNonEVMModal,
        closeClaimNonEVMModal,
        brightidModalStatus,
        claimNonEVMModalStatus,
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
