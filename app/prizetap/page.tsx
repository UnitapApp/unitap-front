// import { BrightConnectionModal } from "@/components/containers/modals";
import LineaCheckWalletsModal from "@/app/prizetap/components/Linea/LineaCheckWalletsModal";
import LineaWinnersModal from "@/app/prizetap/components/Linea/LineaWinnersModal";
import EnrollModal from "@/app/prizetap/components/Modals/enroll-modal";
import RafflesList from "@/app/prizetap/components/RafflesList";
import Header from "@/app/prizetap/components/header";
import { FC } from "react";

import "./styles.scss";
import SearchInput from "./components/searchInput";

const PrizeTapPage: FC = () => {
  return (
    <>
      <Header />
      <SearchInput className="mt-1 w-full md:w-1/3 lg:mt-0" />
      <RafflesList />
      <LineaCheckWalletsModal />
      <LineaWinnersModal />
      <EnrollModal />
      {/* <BrightConnectionModal /> */}
    </>
  );
};

export default PrizeTapPage;
