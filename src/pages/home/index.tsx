import React, { useContext } from "react";
import styled from "styled-components";

import ChainList from "./components/Chainlist/chainlist";
import Navbar from "components/common/Navbar/navbar";
import Header from "pages/home/components/Header/header";
import Footer from "../../components/common/Footer/footer";
import ProvideGasCard from "./components/ProvideGasCard/provideGasCard";

import { Body } from "components/common/Body/body";
import { DV } from "components/basic/designVariables";
import Timer from "./components/Timer/timer";
import SearchInput from "./components/SearchInput/searchInput";
import { Row } from "components/basic/Row/row";
import { Col } from "components/basic/Col/col";
import ClaimModal from "./components/ClaimModal/claimModal";
import BrightConnectionModal from "./components/BrightConnectionModal/brightConnectionModal";
import { ChainType, Network } from "types";
import { ClaimContext } from "hooks/useChainList";

const HomeContentWrapper = styled.div`
  max-width: 1310px;
  margin: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: ${DV.sizes.basePadding * 4.5}px ${DV.sizes.basePadding * 11.25}px;

  @media only screen and (max-width: ${DV.breakpoints.mobile}) {
    padding: ${DV.sizes.basePadding * 2}px ${DV.sizes.basePadding * 3}px;
  }
`;

const Home = () => {
  const {selectedNetwork, setSelectedNetwork} = useContext(ClaimContext);
  const {selectedChainType, setSelectedChainType} = useContext(ClaimContext);

  return (
    <>
      <Navbar />
      <Body>
        <HomeContentWrapper>
          <Row>
            <Col xs={24} md={24} lg={24} xlg={24}>
              <Header />
            </Col>
          </Row>
          <Row mdReverse>
            <Col xs={12} md={12} lg={5.5} xlg={4}>
              <SearchInput />
            </Col>
            <Col xs={0} md={0} lg={0.5} xlg={1.5}></Col>
            <div className="flex mb-2 md:mb-0 justify-between md:justify-end items-center md:ml-auto">
              <div className="switch flex items-center border-2 border-gray30 bg-gray40 rounded-xl">
                <div className={`switch__option w-[20vw] md:w-20 p-3 text-center text-xs cursor-pointer ${selectedChainType===ChainType.EVM ? `text-white` : `text-gray80`}`} onClick={() => {setSelectedChainType(ChainType.EVM)}}>
                  EVM
                </div>
                <div
                  className={`switch__option w-[20vw] md:w-20 p-3 text-center text-xs border-l-2 border-l-gray30 cursor-pointer ${
                    selectedChainType===ChainType.NONEVM ? `text-white` : `text-gray80`
                  }`}
                  onClick={() => {setSelectedChainType(ChainType.NONEVM)}}
                >
                  nonEVM
                </div>
              </div>
              <div className="switch flex items-center border-2 border-gray30 bg-gray40 rounded-xl ml-3">
                <div className={`switch__option w-[20vw] md:w-20 p-3 text-center text-xs cursor-pointer ${selectedNetwork===Network.MAINNET ? `text-white` : `text-gray80`}`} onClick={() => {setSelectedNetwork(Network.MAINNET)}}>
                  Mainnets
                </div>
                <div
                  className={`switch__option w-[20vw] md:w-20 p-3 text-center text-xs border-l-2 border-l-gray30 cursor-pointer ${
                    selectedNetwork===Network.TESTNET ? `text-white` : `text-gray80`
                  }`}
                  onClick={() => {setSelectedNetwork(Network.TESTNET)}}
                >
                  Testnets
                </div>
              </div>
            </div>
          </Row>
          <ChainList />
          <p className='provide-gas-title text-white text-xl mr-auto mb-3'>GasTap Chains Balances</p>
          <ProvideGasCard />
        </HomeContentWrapper>
      </Body>
      <ClaimModal />
      <BrightConnectionModal />
      <Footer />
    </>
  );
};

export default Home;
