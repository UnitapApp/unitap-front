import ClaimNonEVMModal from "@/components/containers/gas-tap/Modals/claimNonEVMModal"
import ClaimModal from "@/components/containers/gas-tap/Modals/ClaimModal"
import Header from "@/components/containers/gas-tap/header"
import { Metadata } from "next"
import GasTapMainContent from "@/components/containers/gas-tap"
import FundContextProvider from "@/components/containers/gas-tap/Modals/FundGasModal"
import ProvideGasCard from "@/components/containers/gas-tap/Cards/ProvideGasCard/provideGasCard"

export const metadata: Metadata = {
  title: "Unitap | Gas Tap ⛽",
  description: "Enjoy surfing Web3 without the worry of gas fees",
}

const GasTap = () => {
  return (
    <FundContextProvider>
      <Header />
      <GasTapMainContent />

      <ProvideGasCard />
      <ClaimModal />
      <ClaimNonEVMModal />
    </FundContextProvider>
  )
}

export default GasTap
