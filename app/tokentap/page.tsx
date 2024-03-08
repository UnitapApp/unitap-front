import Header from "./components/Header";
import ClaimTokenModal from "./components/Modals/ClaimModal";
import TokensList from "./components/TokensList";
import SearchInput from "./components/searchInput";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Unitap | Token Tap 🪙",
  description:
    "Where everyone can claim any kind of tokens such as community tokens, NFTs, UBI tokens",
};

const TokenTapPage = () => {
  return (
    <>
      <Header />
      <SearchInput className="mt-1 lg:mt-0 w-full md:w-1/3" />
      <TokensList />

      <ClaimTokenModal />
    </>
  );
};

export default TokenTapPage;
