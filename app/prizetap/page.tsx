import { BrightConnectionModal } from "@/components/containers/modals";
import LineaCheckWalletsModal from "@/app/prizetap/components/Linea/LineaCheckWalletsModal";
import LineaWinnersModal from "@/app/prizetap/components/Linea/LineaWinnersModal";
import EnrollModal from "@/app/prizetap/components/Modals/enroll-modal";
import RafflesList from "@/app/prizetap/components/RafflesList";
import Header from "@/app/prizetap/components/header";
import { FC } from "react";

import "./styles.scss";

const PrizeTapPage: FC = () => {
  return (
    <>
      <Header />
      <RafflesList />
      <LineaCheckWalletsModal />
      <LineaWinnersModal />
      <EnrollModal />
      <BrightConnectionModal />
    </>
  );
};

export default PrizeTapPage;
