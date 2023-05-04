import React, {useContext} from 'react';

import ChainList from './components/Chainlist/chainlist';
import Navbar from 'components/common/Navbar/navbar';
import Header from 'pages/home/components/Header/header';
import Footer from '../../components/common/Footer/footer';
import ProvideGasCard from './components/ProvideGasCard/provideGasCard';
import SearchInput from './components/SearchInput/searchInput';
import {Row} from 'components/basic/Row/row';
import {Col} from 'components/basic/Col/col';
import ClaimModal from './components/ClaimModal/claimModal';
import {Network} from 'types';
import {ClaimContext} from 'hooks/useChainList';
import {ChainType} from 'types';
import ClaimNonEVMModal from './components/ClaimNonEVMModal/claimNonEVMModal';

const Home = () => {
  const {selectedNetwork, setSelectedNetwork} = useContext(ClaimContext);
  const {selectedChainType, setSelectedChainType} = useContext(ClaimContext);
  const {searchPhrase} = useContext(ClaimContext);

  return (
    <>
      <Navbar/>
      <div className={'content-wrapper'}>
        <div className={'flex flex-col justify-center items-center w-full'}>
          <Row>
            <Col xs={24} md={24} lg={24} xlg={24}>
              <Header/>
            </Col>
          </Row>
          <Row mdReverse>
            <Col xs={12} md={12} lg={5.5} xlg={4} className={'mt-1 lg:mt-0'}>
              <SearchInput/>
            </Col>
            <Col className={'mb-1 lg:mb-0'} xs={0} md={0} lg={0.5} xlg={1.5}></Col>
            {searchPhrase === "" &&
              <div className="flex mb-2 md:mb-0 justify-between md:justify-end items-center md:ml-auto">
                <div className="switch flex items-center border-2 border-gray30 bg-gray30 rounded-xl">
                  <div
                    className={`switch__option w-[20vw] md:w-[72px] px-1 py-3 text-center text-xs cursor-pointer rounded-l-[11px] ${
                      selectedChainType === ChainType.ALL ? `text-white bg-gray50` : `text-gray80`
                    }`}
                    onClick={() => {
                      setSelectedChainType(ChainType.ALL);
                    }}
                  >
                    ALL
                  </div>
                  <div
                    className={`switch__option w-[20vw] md:w-[72px] px-1 py-3 text-center text-xs cursor-pointer ${
                      selectedChainType === ChainType.EVM ? `text-white bg-gray50` : `text-gray80`
                    }`}
                    onClick={() => {
                      setSelectedChainType(ChainType.EVM);
                    }}
                  >
                    EVM
                  </div>
                  <div
                    className={`switch__option w-[20vw] md:w-[72px] px-1 py-3 text-center text-xs border-l-2 border-l-gray30 cursor-pointer rounded-r-[11px] ${
                      selectedChainType === ChainType.NONEVM ? `text-white bg-gray50` : `text-gray80`
                    }`}
                    onClick={() => {
                      setSelectedChainType(ChainType.NONEVM);
                    }}
                  >
                    nonEVM
                  </div>
                </div>
                <div className="switch flex items-center border-2 border-gray30 bg-gray30 rounded-xl ml-3">
                  <div
                    className={`switch__option w-[20vw] md:w-[72px] px-1 py-3 text-center text-xs cursor-pointer rounded-l-[11px] ${
                      selectedNetwork === Network.ALL ? `text-white bg-gray50` : `text-gray80`
                    }`}
                    onClick={() => {
                      setSelectedNetwork(Network.ALL);
                    }}
                  >
                    ALL
                  </div>
                  <div
                    className={`switch__option w-[20vw] md:w-[72px] px-1 py-3 text-center text-xs cursor-pointer ${
                      selectedNetwork === Network.MAINNET ? `text-white bg-gray50` : `text-gray80`
                    }`}
                    onClick={() => {
                      setSelectedNetwork(Network.MAINNET);
                    }}
                  >
                    Mainnets
                  </div>
                  <div
                    className={`switch__option w-[20vw] md:w-[72px] px-1 py-3 text-center text-xs border-l-2 border-l-gray30 rounded-r-[11px] cursor-pointer ${
                      selectedNetwork === Network.TESTNET ? `text-white bg-gray50` : `text-gray80`
                    }`}
                    onClick={() => {
                      setSelectedNetwork(Network.TESTNET);
                    }}
                  >
                    Testnets
                  </div>
                </div>
              </div>
            }
          </Row>
          <ChainList/>
          <p className="provide-gas-title text-white text-xl mr-auto mb-3">GasTap Chains Balances</p>
          <ProvideGasCard/>
        </div>
      </div>
      <ClaimModal/>
      <ClaimNonEVMModal/>
      <Footer/>
    </>
  );
};

export default Home;
