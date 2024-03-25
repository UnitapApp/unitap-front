import { BrightConnectionModal } from "@/components/containers/modals";
import LineaCheckWalletsModal from "@/app/prizetap/components/Linea/LineaCheckWalletsModal";
import LineaWinnersModal from "@/app/prizetap/components/Linea/LineaWinnersModal";
import EnrollModal from "@/app/prizetap/components/Modals/enroll-modal";
import RafflesList from "@/app/prizetap/components/RafflesList";
import Header from "@/app/prizetap/components/header";
import { FC } from "react";

import "./styles.scss";
import ContributionPrizetap from "./components/footer-button";

const PrizeTapPage: FC = () => {
  return (
    <>
      <Header />
      <RafflesList />
      <ContributionPrizetap />
      <LineaCheckWalletsModal />
      <LineaWinnersModal />
      <EnrollModal />
      <BrightConnectionModal />
    </>
  );
};

export default PrizeTapPage;
