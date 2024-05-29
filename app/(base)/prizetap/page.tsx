import { BrightConnectionModal } from "@/components/containers/modals"
import LineaCheckWalletsModal from "@/app/(base)/prizetap/components/Linea/LineaCheckWalletsModal"
import LineaWinnersModal from "@/app/(base)/prizetap/components/Linea/LineaWinnersModal"
import EnrollModal from "@/app/(base)/prizetap/components/Modals/enroll-modal"
import RafflesList from "@/app/(base)/prizetap/components/RafflesList"
import Header from "@/app/(base)/prizetap/components/header"
import { FC } from "react"

import "./styles.scss"
import ContributionPrizetap from "./components/footer-button"
import SearchInput from "./components/searchInput"

const PrizeTapPage: FC = () => {
  return (
    <>
      <Header />
      <SearchInput className="mt-1 w-full md:w-1/3 lg:mt-0" />
      <RafflesList />
      <ContributionPrizetap />
      <LineaCheckWalletsModal />
      <LineaWinnersModal />
      <EnrollModal />
      <BrightConnectionModal />
    </>
  )
}

export default PrizeTapPage
