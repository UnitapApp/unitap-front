import Header from "@/components/containers/token-tap/Header";
import ClaimTokenModal from "@/components/containers/token-tap/Modals/ClaimModal";
import TokensList from "@/components/containers/token-tap/TokensList";
import SearchInput from "@/components/containers/token-tap/searchInput";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Unitap | Token Tap 🪙",
  description: "Get the tasks done and claim your rewards",
};

const TokenTapPage = () => {
  return (
    <>
      <Header />
      <SearchInput className="mt-1 w-full md:w-1/3 lg:mt-0" />
      <TokensList />

      <ClaimTokenModal />
    </>
  );
};

export default TokenTapPage;
