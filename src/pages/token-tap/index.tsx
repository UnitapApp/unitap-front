import React from "react";

import Header from "./components/Header/Header";
import Navbar from "components/common/Navbar/navbar";
import Footer from "components/common/Footer/footer";
import TokensList from "./components/TokensList/TokensList";
import SearchInput from "./components/SearchInput/searchInput";
import ClaimModal from "pages/home/components/ClaimModal/claimModal";
import BrightConnectionModal from "pages/home/components/BrightConnectionModal/brightConnectionModal";

const TokenTap = () => {
  return (
    <>
      <Navbar />
      <div className="content-wrapper">
        <Header />
        <SearchInput className="mt-1 lg:mt-0 w-full md:w-1/3" />
        <TokensList />
      </div>
      <Footer />

      <ClaimModal />
      <BrightConnectionModal />
    </>
  );
};

export default TokenTap;
