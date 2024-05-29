import Header from "./components/Header";
import TokensList from "./components/TokensList";
import SearchInput from "./components/searchInput";
import { Metadata } from "next";

const ClaimTokenModal = dynamic(() => import("./components/Modals/ClaimModal"));

import "./styles.scss";
import dynamic from "next/dynamic";

export const metadata: Metadata = {
  title: "Unitap | Token Tap 🪙",
  description:
    "Where everyone can claim any kind of tokens such as community tokens, NFTs, UBI tokens",
};

const TokenTapPage = () => {
  return (
    <>
      <Header />
      <SearchInput className="mt-1 w-full md:!w-72 lg:mt-0" />
      <TokensList />

      <ClaimTokenModal />
    </>
  );
};

export default TokenTapPage;
