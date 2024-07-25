import ClaimNonEVMModal from "./components/Modals/claimNonEVMModal";
import ClaimModal from "./components/Modals/ClaimModal";
import Header from "./components/header";
import { Metadata } from "next";
import GasTapMainContent from "./components";
import FundContextProvider from "./components/Modals/FundGasModal";

export const metadata: Metadata = {
  title: "Unitap | Gas Tap ⛽",
  description: "Obtain gas token for free and enjoy exploring ecosystems",
};

const GasTap = () => {
  return (
    <FundContextProvider>
      <Header />
      <GasTapMainContent />

      <ClaimModal />
      <ClaimNonEVMModal />
    </FundContextProvider>
  );
};

export default GasTap;
