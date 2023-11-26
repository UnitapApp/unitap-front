"use client"

import {
  BrightIdConnectionModalState,
  BrightIdModalState,
  HaveBrightIdAccountModalState,
} from "@/types"
import { EmptyCallback } from "@/utils"
import {
  FC,
  PropsWithChildren,
  createContext,
  useContext,
  useState,
} from "react"

export type GlobalContextType = {
  openBrightIdModal: () => void
  closeBrightIdModal: () => void
  brightidModalStatus: BrightIdModalState
  openHaveBrightIdAccountModal: () => void
  closeHaveBrightIdAccountModal: () => void
  haveBrightIdAccountModalStatus: HaveBrightIdAccountModalState
  openBrightIdConnectionModal: () => void
  closeBrightIdConnectionModal: () => void
  brightIdConnectionModalStatus: BrightIdConnectionModalState
  isWalletPromptOpen: boolean
  setIsWalletPromptOpen: (arg: boolean) => void
}

export const GlobalContext = createContext<GlobalContextType>({
  openBrightIdModal: EmptyCallback,
  closeBrightIdModal: EmptyCallback,
  brightidModalStatus: BrightIdModalState.CLOSED,
  openHaveBrightIdAccountModal: EmptyCallback,
  closeHaveBrightIdAccountModal: EmptyCallback,
  haveBrightIdAccountModalStatus: HaveBrightIdAccountModalState.CLOSED,
  openBrightIdConnectionModal: EmptyCallback,
  closeBrightIdConnectionModal: EmptyCallback,
  brightIdConnectionModalStatus: BrightIdConnectionModalState.CLOSED,
  isWalletPromptOpen: false,
  setIsWalletPromptOpen: EmptyCallback,
})

export const useGlobalContext = () => useContext(GlobalContext)

export const GlobalContextProvider: FC<PropsWithChildren> = ({ children }) => {
  const [brightidModalStatus, setBrightidModalStatus] =
    useState<BrightIdModalState>(BrightIdModalState.CLOSED)

  const [haveBrightIdAccountModalStatus, setHaveBrightIdAccountModalStatus] =
    useState<HaveBrightIdAccountModalState>(
      HaveBrightIdAccountModalState.CLOSED
    )

  const [isWalletPromptOpen, setIsWalletPromptOpen] = useState(false)

  const [brightIdConnectionModalStatus, setBrightIdConnectionModalStatus] =
    useState<BrightIdConnectionModalState>(BrightIdConnectionModalState.CLOSED)

  const openBrightIdModal = () => {
    setBrightidModalStatus(BrightIdModalState.OPENED)
  }
  const closeBrightIdModal = () => {
    setBrightidModalStatus(BrightIdModalState.CLOSED)
  }

  const openHaveBrightIdAccountModal = () => {
    setHaveBrightIdAccountModalStatus(HaveBrightIdAccountModalState.OPENED)
  }
  const closeHaveBrightIdAccountModal = () => {
    setHaveBrightIdAccountModalStatus(HaveBrightIdAccountModalState.CLOSED)
  }

  const openBrightIdConnectionModal = () => {
    setBrightIdConnectionModalStatus(BrightIdConnectionModalState.OPENED)
  }
  const closeBrightIdConnectionModal = () => {
    setBrightIdConnectionModalStatus(BrightIdConnectionModalState.CLOSED)
  }

  return (
    <GlobalContext.Provider
      value={{
        openBrightIdModal,
        closeBrightIdModal,
        brightidModalStatus,
        openHaveBrightIdAccountModal,
        closeHaveBrightIdAccountModal,
        haveBrightIdAccountModalStatus,
        openBrightIdConnectionModal,
        closeBrightIdConnectionModal,
        brightIdConnectionModalStatus,
        isWalletPromptOpen,
        setIsWalletPromptOpen,
      }}
    >
      {children}
    </GlobalContext.Provider>
  )
}
