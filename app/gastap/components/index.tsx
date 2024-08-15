"use client";

import { useGasTapContext } from "@/context/gasTapProvider";
import ChainList from "./Cards/Chainlist";
import Filters from "./filters";
import SearchInput from "./searchInput";

export const GasTapMainContent = () => {
  const { searchPhrase } = useGasTapContext();
  return (
    <>
      <div className="action-bar flex flex-col-reverse items-center justify-between md:flex-row">
        <SearchInput className="w-full sm:w-1/2 md:w-1/3" />
        {searchPhrase === "" && <Filters />}
      </div>
      <ChainList />
    </>
  );
};

export default GasTapMainContent;
