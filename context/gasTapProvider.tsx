"use client"

import {
  ClaimReceipt,
  PK,
  ClaimBoxState,
  ClaimNonEVMModalState,
  Network,
  ChainType,
  Chain,
  ClaimBoxStateContainer,
  ClaimReceiptState,
} from "@/types"
import { EmptyCallback } from "@/utils"
import {
  FC,
  PropsWithChildren,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react"
import { useUserProfileContext } from "./userProfile"
import {
  claimMax,
  claimMaxNonEVMAPI,
  getActiveClaimHistory,
  getChainList,
} from "@/utils/api"
import { useFastRefresh, useRefreshWithInitial } from "@/utils/hooks/refresh"
import getCorrectAddress, { useWalletAccount } from "@/utils/wallet"
import { FAST_INTERVAL } from "@/constants"
import { useGlobalContext } from "./globalProvider"

export const GasTapContext = createContext<{
  chainList: Chain[]
  chainListSearchResult: Chain[]
  chainListSearchSimpleResult: Chain[]
  changeSearchPhrase: ((newSearchPhrase: string) => void) | null
  claim: (chainPK: number) => void
  claimNonEVM: (chain: Chain, address: string) => void
  activeClaimReceipt: ClaimReceipt | null
  activeClaimHistory: ClaimReceipt[]
  isNonEvmActive: boolean
  closeClaimModal: () => void
  openClaimModal: (chainPk: PK) => void
  activeChain: Chain | null
  claimBoxStatus: { status: ClaimBoxState; lastFailPk: number | null }
  selectedNetwork: Network
  selectedChainType: ChainType
  setSelectedNetwork: (network: Network) => void
  setSelectedChainType: (chainType: ChainType) => void
  claimLoading: boolean
  searchPhrase: string
  isHighGasFeeModalOpen: boolean
  changeIsHighGasFeeModalOpen: (isOpen: boolean) => void
}>({
  chainList: [],
  chainListSearchResult: [],
  chainListSearchSimpleResult: [],
  changeSearchPhrase: null,
  claim: EmptyCallback,
  claimNonEVM: EmptyCallback,
  activeClaimReceipt: null,
  activeClaimHistory: [],
  closeClaimModal: EmptyCallback,
  openClaimModal: EmptyCallback,
  activeChain: null,
  claimBoxStatus: { status: ClaimBoxState.CLOSED, lastFailPk: null },
  selectedNetwork: Network.MAINNET,
  selectedChainType: ChainType.EVM,
  setSelectedNetwork: EmptyCallback,
  setSelectedChainType: EmptyCallback,
  claimLoading: false,
  searchPhrase: "",
  isHighGasFeeModalOpen: false,
  isNonEvmActive: true,
  changeIsHighGasFeeModalOpen: EmptyCallback,
})

export const useGasTapContext = () => useContext(GasTapContext)

export const GasTapProvider: FC<
  {
    chains: Chain[]
  } & PropsWithChildren
> = ({ children, chains }) => {
  const [chainList, setChainList] = useState(chains)
  const [activeChain, setActiveChain] = useState<Chain | null>(null)
  const [isNonEvmActive, setIsNonEvmActive] = useState<boolean>(false)
  const [searchPhrase, setSearchPhrase] = useState<string>("")
  const [activeClaimReceipt, setActiveClaimReceipt] =
    useState<ClaimReceipt | null>(null)
  const [claimBoxStatus, setClaimBoxStatus] = useState<ClaimBoxStateContainer>({
    status: ClaimBoxState.CLOSED,
    lastFailPk: null,
  })

  const [claimLoading, setClaimLoading] = useState(false)

  const { userProfile, userToken } = useUserProfileContext()

  const [activeClaimHistory, setActiveClaimHistory] = useState<ClaimReceipt[]>(
    []
  )
  const [isHighGasFeeModalOpen, setIsHighGasFeeModalOpen] = useState(false)
  const changeIsHighGasFeeModalOpen = useCallback((isOpen: boolean) => {
    setIsHighGasFeeModalOpen(isOpen)
  }, [])

  const [selectedNetwork, setSelectedNetwork] = useState(Network.MAINNET)
  const [selectedChainType, setSelectedChainType] = useState(ChainType.ALL)

  const chainListSearchResult = useMemo(
    () =>
      searchChainList(
        searchPhrase,
        chainList,
        selectedNetwork,
        selectedChainType
      ),
    [searchPhrase, chainList, selectedNetwork, selectedChainType]
  )

  const { setIsWalletPromptOpen } = useGlobalContext()
  const { isConnected } = useWalletAccount()

  const updateChainList = useCallback(async () => {
    try {
      const newChainList = await getChainList()
      setChainList(newChainList)
    } catch (e) {}
  }, [])

  const updateActiveClaimHistory = useCallback(async () => {
    if (userToken && userProfile) {
      try {
        const newClaimHistory = await getActiveClaimHistory(userToken)
        setActiveClaimHistory(newClaimHistory)
      } catch (e) {}
    }
  }, [userToken, userProfile])

  const openClaimModal = useCallback(
    (chainPk: PK) => {
      if (!isConnected) {
        setIsWalletPromptOpen(true)
        return
      }

      let chain = chainList.find((chan) => chan.pk === chainPk)

      if (!chain) return

      if (chain.chainType === ChainType.EVM) {
        setActiveChain(chain)
        setIsNonEvmActive(false)
      } else if (
        chain.chainType === ChainType.NONEVMXDC ||
        chain.chainType === ChainType.SOLANA ||
        chain.chainType === ChainType.LIGHTNING
      ) {
        setActiveChain(chain)
        setIsNonEvmActive(true)
      }
    },
    [chainList, isConnected]
  )

  const claimNonEVM = async (
    chain: Chain,
    address: string,
    userToken: string
  ) => {
    try {
      let correctAddress = getCorrectAddress(chain, address)
      await claimMaxNonEVMAPI(userToken, chain.pk, correctAddress)

      await updateActiveClaimHistory()
    } catch (ex) {
      await updateActiveClaimHistory()
    } finally {
      setTimeout(() => {
        setClaimLoading(false)
      }, 1000)
    }
  }

  const claim = useCallback(
    async (claimChainPk: number, address?: string) => {
      if (!userToken || claimLoading) {
        return
      }
      setClaimLoading(true)

      if (isNonEvmActive && address) {
        return await claimNonEVM(
          chainList.find((item) => item.pk === claimChainPk)!,
          address,
          userToken
        )
      }

      if (activeClaimReceipt)
        setClaimBoxStatus({
          status: ClaimBoxState.INITIAL,
          lastFailPk: activeClaimReceipt.pk,
        })

      try {
        await claimMax(userToken, claimChainPk)
        setTimeout(() => {
          setClaimLoading(false)
        }, 1000)
        await updateActiveClaimHistory()
      } catch (ex) {
        setClaimLoading(false)
        await updateActiveClaimHistory()
      }
    },
    [
      userToken,
      updateActiveClaimHistory,
      activeClaimReceipt,
      claimLoading,
      isNonEvmActive,
    ]
  )

  const chainListSearchSimpleResult = useMemo(
    () => searchChainListSimple(searchPhrase, chainList),
    [searchPhrase, chainList]
  )

  useFastRefresh(() => {
    updateChainList()
  }, [updateChainList])

  useRefreshWithInitial(
    () => {
      updateActiveClaimHistory()
    },
    FAST_INTERVAL,
    [updateActiveClaimHistory]
  )

  useEffect(() => {
    if (activeChain) {
      setActiveClaimReceipt(
        getActiveClaimReceipt(activeClaimHistory, activeChain, "EVM")
      )
    } else if (isNonEvmActive) {
      setActiveClaimReceipt(
        getActiveClaimReceipt(activeClaimHistory, activeChain, "NONEVM")
      )
    }
  }, [activeChain, isNonEvmActive, setActiveClaimReceipt, activeClaimHistory])

  return (
    <GasTapContext.Provider
      value={{
        activeChain,
        activeClaimHistory,
        chainList,
        chainListSearchResult,
        openClaimModal,
        setSelectedNetwork,
        selectedChainType,
        setSelectedChainType,
        searchPhrase,
        selectedNetwork,
        isHighGasFeeModalOpen,
        changeIsHighGasFeeModalOpen,
        isNonEvmActive,
        closeClaimModal: () => setActiveChain(null),
        changeSearchPhrase: (newSearchPhrase: string) =>
          setSearchPhrase(newSearchPhrase),
        chainListSearchSimpleResult,
        activeClaimReceipt,
        claimBoxStatus,
        claim,
        claimLoading,
        claimNonEVM: (chain, address) => claim(chain.pk, address),
      }}
    >
      {children}
    </GasTapContext.Provider>
  )
}

const getNetworkFilterResult = (
  selectedNetwork: Network,
  chainList: Chain[]
) => {
  if (selectedNetwork === Network.MAINNET) {
    chainList = chainList.filter((chain) => chain.isTestnet === false)
  } else if (selectedNetwork === Network.TESTNET) {
    chainList = chainList.filter((chain) => chain.isTestnet === true)
  }
  return chainList
}

const getChainTypeFilterResult = (
  selectedChainType: ChainType,
  chainList: Chain[]
) => {
  if (selectedChainType === ChainType.EVM) {
    chainList = chainList.filter((chain) => chain.chainType === ChainType.EVM)
  } else if (selectedChainType === ChainType.NONEVM) {
    chainList = chainList.filter(
      (chain) =>
        chain.chainType === ChainType.NONEVMXDC ||
        chain.chainType === ChainType.SOLANA ||
        chain.chainType === ChainType.LIGHTNING
    )
  }
  return chainList
}

const getSearchQueryResult = (searchPhrase: string, chainList: Chain[]) => {
  if (searchPhrase === "") return chainList

  const filteredChains: Chain[] = chainList.filter(
    (chain) =>
      chain.nativeCurrencyName
        .toLowerCase()
        .includes(searchPhrase.toLowerCase()) ||
      chain.chainName.toLowerCase().includes(searchPhrase.toLowerCase())
  )

  return filteredChains
}

export const searchChainListSimple = (
  searchPhrase: string,
  chainList: Chain[]
) => {
  let searchChainListResult = getSearchQueryResult(searchPhrase, chainList)
  return searchChainListResult
}

export const searchChainList = (
  searchPhrase: string,
  chainList: Chain[],
  selectedNetwork: Network,
  selectedChainType: ChainType
) => {
  if (searchPhrase !== "") return getSearchQueryResult(searchPhrase, chainList)

  let searchChainListResult = getNetworkFilterResult(selectedNetwork, chainList)
  searchChainListResult = getChainTypeFilterResult(
    selectedChainType,
    searchChainListResult
  )
  return searchChainListResult
}

const getActiveClaimReceipt = (
  activeClaimHistory: ClaimReceipt[],
  activeChain: Chain | null,
  chainType: string
) => {
  if (!activeChain) return null

  const filteredClaimHistory = activeClaimHistory.filter(
    (claimReceipt: ClaimReceipt) => claimReceipt.chain.pk === activeChain.pk
  )

  let selectedClaimReceipt = null

  if (chainType === "EVM") {
    selectedClaimReceipt =
      filteredClaimHistory.find(
        (claimReceipt: ClaimReceipt) =>
          claimReceipt.status === ClaimReceiptState.VERIFIED
      ) ||
      filteredClaimHistory.find(
        (claimReceipt: ClaimReceipt) =>
          claimReceipt.status === ClaimReceiptState.PENDING
      ) ||
      filteredClaimHistory.find(
        (claimReceipt: ClaimReceipt) =>
          claimReceipt.status === ClaimReceiptState.REJECTED
      )
  } else if (chainType === "NONEVM") {
    selectedClaimReceipt =
      filteredClaimHistory.find(
        (claimReceipt: ClaimReceipt) =>
          claimReceipt.status === ClaimReceiptState.VERIFIED
      ) ||
      filteredClaimHistory.find(
        (claimReceipt: ClaimReceipt) =>
          claimReceipt.status === ClaimReceiptState.PENDING
      ) ||
      filteredClaimHistory.find(
        (claimReceipt: ClaimReceipt) =>
          claimReceipt.status === ClaimReceiptState.REJECTED
      )
  }

  return selectedClaimReceipt || null
}

export default GasTapProvider
