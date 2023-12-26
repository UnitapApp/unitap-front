import { BrightConnectionModal } from "@/components/containers/modals";
import LineaCheckWalletsModal from "@/components/containers/prize-tap/Linea/LineaCheckWalletsModal";
import LineaWinnersModal from "@/components/containers/prize-tap/Linea/LineaWinnersModal";
import EnrollModal from "@/components/containers/prize-tap/Modals/enroll-modal";
import RafflesList from "@/components/containers/prize-tap/RafflesList";
import Header from "@/components/containers/prize-tap/header";
import { FC } from "react";

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
