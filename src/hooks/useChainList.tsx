import React, { createContext, PropsWithChildren, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { claimMax, claimMaxNonEVMAPI, getActiveClaimHistory, getChainList } from 'api';
import {
  BrightIdConnectionModalState,
  BrightIdModalState,
  Chain,
  ChainType,
  ClaimBoxState,
  ClaimBoxStateContainer,
  ClaimNonEVMModalState,
  ClaimReceipt,
  HaveBrightIdAccountModalState,
  Network, PK,
} from 'types';
import { UserProfileContext } from './useUserProfile';
import { RefreshContext } from 'context/RefreshContext';
import getActiveClaimReciept from 'utils/hook/getActiveClaimReciept';
import removeRequest from 'utils/hook/claimRequests';
import { searchChainList, searchChainListSimple } from 'utils/hook/searchChainList';

export const ClaimContext = createContext<{
  chainList: Chain[];
  chainListSearchResult: Chain[];
  chainListSearchSimpleResult: Chain[];
  changeSearchPhrase: ((newSearchPhrase: string) => void) | null;
  claim: (chainPK: number) => void;
  claimNonEVM: (chainPK: number, address: string) => void;
  activeClaimReceipt: ClaimReceipt | null;
  activeClaimHistory: ClaimReceipt[];
  closeClaimModal: () => void;
  openClaimModal: (chainPk: PK) => void;
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
  claimNonEVMLoading: boolean;
  claimLoading: boolean;
  searchPhrase: string;
}>({
  chainList: [],
  chainListSearchResult: [],
  chainListSearchSimpleResult: [],
  changeSearchPhrase: null,
  claim: (chainPK: number) => {},
  claimNonEVM: (chainPK: number, address: string) => {},
  activeClaimReceipt: null,
  activeClaimHistory: [],
  closeClaimModal: () => {},
  openClaimModal: (chainPk: PK) => {},
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
  claimNonEVMLoading: false,
  claimLoading: false,
  searchPhrase: '',
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
  const [claimNonEVMModalStatus, setClaimNonEVMModalStatus] = useState<ClaimNonEVMModalState>(
    ClaimNonEVMModalState.CLOSED,
  );
  const [haveBrightIdAccountModalStatus, setHaveBrightIdAccountModalStatus] = useState<HaveBrightIdAccountModalState>(
    HaveBrightIdAccountModalState.CLOSED,
  );
  const [brightIdConnectionModalStatus, setBrightIdConnectionModalStatus] = useState<BrightIdConnectionModalState>(
    BrightIdConnectionModalState.CLOSED,
  );

  const [activeChain, setActiveChain] = useState<Chain | null>(null);
  const [activeNonEVMChain, setActiveNonEVMChain] = useState<Chain | null>(null);

  // list of chian.pk of requesting claims
  const [claimRequests, setClaimRequests] = useState<number[]>([]);
  const [claimNonEVMLoading, setClaimNonEVMLoading] = useState(false);
  const [claimLoading, setClaimLoading] = useState(false);

  const { userProfile, userToken } = useContext(UserProfileContext);
  const { fastRefresh } = useContext(RefreshContext);

  const updateChainList = useCallback(async () => {
    try {
      const newChainList = await getChainList();
      setChainList(newChainList);
    } catch (e) {}
  }, []);

  const updateActiveClaimHistory = useCallback(async () => {
    if (userToken && userProfile) {
      try {
        const newClaimHistory = await getActiveClaimHistory(userToken);
        setActiveClaimHistory(newClaimHistory);
      } catch (e) {}
    }
  }, [userToken, userProfile]);

  useEffect(() => {
    updateChainList();
    updateActiveClaimHistory();
  }, [fastRefresh, updateActiveClaimHistory, updateChainList]);

  useEffect(() => {
    if (activeChain) {
      setActiveClaimReceipt(getActiveClaimReciept(activeClaimHistory, activeChain, 'EVM'));
    } else if (activeNonEVMChain) {
      setActiveClaimReceipt(getActiveClaimReciept(activeClaimHistory, activeNonEVMChain, 'NONEVM'));
    }
  }, [activeChain, activeNonEVMChain, setActiveClaimReceipt, activeClaimHistory]);

  const openClaimModal = useCallback((chainPk: PK) => {
    let chain = chainList.find((chan) => chan.pk === chainPk);
    if (!chain) return;
    if (chain.chainType === ChainType.EVM) {
      setActiveChain(chain);
    } else if (chain.chainType === ChainType.NONEVM || chain.chainType === ChainType.SOLANA || chain.chainType === ChainType.LIGHTNING) {
      setActiveNonEVMChain(chain);
      setClaimNonEVMModalStatus(ClaimNonEVMModalState.OPENED);
    }
  }, [chainList]);

  const closeClaimModal = useCallback(() => {
    setActiveChain(null);
  }, []);

  const retryClaim = useCallback(() => {
    if (activeClaimReceipt) setClaimBoxStatus({ status: ClaimBoxState.INITIAL, lastFailPk: activeClaimReceipt.pk });
  }, [activeClaimReceipt]);


  const claim = useCallback(
    //TODO: tell user about failing to communicate with server
    async (claimChainPk: number) => {
      if (!userToken || claimLoading || claimRequests.filter((chainPk) => chainPk === claimChainPk).length > 0) {
        return;
      }
      setClaimRequests((claimRequests) => [...claimRequests, claimChainPk]);
      setClaimLoading(true);
      try {
        await claimMax(userToken, claimChainPk);
        setTimeout(() => {
          setClaimLoading(false);
        }, 1000);
        await updateActiveClaimHistory();
        setClaimRequests((claimRequests) => removeRequest(claimRequests, claimChainPk));
      } catch (ex) {
        setClaimLoading(false);
        await updateActiveClaimHistory();
        setClaimRequests((claimRequests) => removeRequest(claimRequests, claimChainPk));
      }
    },
    [userToken, claimRequests, updateActiveClaimHistory, claimLoading],
  );

  const claimNonEVM = useCallback(
    async (claimChainPk: number, address: string) => {
      if (!userToken || claimNonEVMLoading || claimRequests.filter((chainPk) => chainPk === claimChainPk).length > 0) {
        return;
      }
      setClaimRequests((claimRequests) => [...claimRequests, claimChainPk]);
      setClaimNonEVMLoading(true);
      try {
        await claimMaxNonEVMAPI(userToken, claimChainPk, address);
        setTimeout(() => {
          setClaimNonEVMLoading(false);
        } , 1000);
        await updateActiveClaimHistory();
        setClaimRequests((claimRequests) => removeRequest(claimRequests, claimChainPk));
      } catch (ex) {
        setClaimNonEVMLoading(false);
        await updateActiveClaimHistory();
        setClaimRequests((claimRequests) => removeRequest(claimRequests, claimChainPk));
      }
    },
    [userToken, claimRequests, updateActiveClaimHistory, claimNonEVMLoading],
  );

  const [selectedNetwork, setSelectedNetwork] = React.useState(Network.ALL);
  const [selectedChainType, setSelectedChainType] = React.useState(ChainType.ALL);

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
        activeClaimHistory,
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
        claimNonEVMLoading,
        claimLoading,
        searchPhrase,
      }}
    >
      {children}
    </ClaimContext.Provider>
  );
}
