import React from 'react';

import Navbar from 'components/common/Navbar/navbar';
import { Row } from 'components/basic/Row/row';
import { Col } from 'components/basic/Col/col';
import Header from 'pages/home/components/Header/header';
import SearchInput from 'pages/home/components/SearchInput/searchInput';
import ChainList from 'pages/home/components/Chainlist/chainlist';
import ClaimModal from 'pages/home/components/ClaimModal/claimModal';
import BrightConnectionModal from 'pages/home/components/BrightConnectionModal/brightConnectionModal';
import Footer from 'components/common/Footer/footer';
import TokensList from './components/TokensList';


const TokenTap = () => {

  return (
    <>
      <Navbar />
      <div className={'unitap-body'}>
        <div
          className={
            'max-w-screen-xl m-auto flex flex-col justify-center items-center w-full py-4 px-6 lg:py-9 lg:px-20'
          }
        >
          <Row>
            <Col xs={24} md={24} lg={24} xlg={24}>
              <Header />
            </Col>
          </Row>
          <Row mdReverse>
            <Col xs={12} md={12} lg={5.5} xlg={4} className={'mt-1 lg:mt-0'}>
              <SearchInput />
            </Col>
          </Row>
          <TokensList />
        </div>
      </div>
      <ClaimModal />
      <BrightConnectionModal />
      <Footer />
    </>
  );
};

export default TokenTap;
