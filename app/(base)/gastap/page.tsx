import Header from "./components/header";
import { Metadata } from "next";
import GasTapMainContent from "./components";
import FundContextProvider from "./components/Modals/FundGasModal";

const ClaimNonEVMModal = dynamic(
  () => import("./components/Modals/claimNonEVMModal"),
);
const ClaimModal = dynamic(() => import("./components/Modals/ClaimModal"));

import "./styles.scss";
import dynamic from "next/dynamic";

export const metadata: Metadata = {
  title: "Unitap | Gas Tap ⛽",
  description: "Enjoy surfing Web3 without the worry of gas fees",
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
