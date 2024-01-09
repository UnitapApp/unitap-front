"use client"

import Modal from "@/components/ui/Modal/modal"
import { useGlobalContext } from "@/context/globalProvider"
import { useWalletAccount } from "@/utils/wallet"
import { useEffect, useMemo, useState } from "react"
import WalletPrompt from "./walletPrompt"
import WalletConnecting from "./walletConnecting"

export enum ConnectionProvider {
  Metamask,
  Walletconnect,
}

const WalletModalBody = () => {
  const [walletProvider, setWalletProvider] = useState<ConnectionProvider>(
    ConnectionProvider.Metamask
  )

  const currentWallet = useMemo(() => {
    if (walletProvider === ConnectionProvider.Metamask) {
      return {
        imageUrl: "/assets/images/modal/metamask-icon.svg",
        label: "Metamask",
        loadingImage: "/assets/images/modal/wallet-metamask-loading.svg",
      }
    }

    return {
      imageUrl: "/assets/images/modal/walletconnect-icon.svg",
      label: "WalletConnect",
      loadingImage: "/assets/images/modal/wallet-connect-loading.svg",
    }
  }, [walletProvider])

  const { isConnecting } = useWalletAccount()

  if (isConnecting) {
    return (
      <WalletConnecting
        imageUrl={currentWallet.imageUrl}
        label={currentWallet.label}
        loadingImage={currentWallet.loadingImage}
      />
    )
  }

  return <WalletPrompt setWalletProvider={setWalletProvider} />
}

export const ConnectWalletModal = () => {
  const { isWalletPromptOpen, setIsWalletPromptOpen } = useGlobalContext()

  const { isConnected } = useWalletAccount()

  useEffect(() => {
    if (isConnected) setIsWalletPromptOpen(false)
  }, [isConnected])

  return (
    <Modal
      title="Connect Wallet"
      size="small"
      isOpen={isWalletPromptOpen}
      closeModalHandler={() => setIsWalletPromptOpen(false)}
    >
      <div className="flex flex-col items-center justify-center pt-12">
        <WalletModalBody />
      </div>
    </Modal>
  )
}
