"use client"

import { useGasTapContext } from "@/context/gasTapProvider"
import ChainList from "./Cards/Chainlist"
import Filters from "./filters"
import SearchInput from "./searchInput"

export const GasTapMainContent = () => {
  const { searchPhrase } = useGasTapContext()
  return (
    <>
      <div className="action-bar flex flex-col-reverse md:flex-row justify-between items-center">
        <SearchInput className="w-full sm:w-1/2 md:w-1/3" />
        {searchPhrase === "" && <Filters />}
      </div>
      <ChainList />
      <p className="provide-gas-title text-white text-xl mr-auto mb-3">
        GasTap Chains Balances
      </p>
    </>
  )
}

export default GasTapMainContent
