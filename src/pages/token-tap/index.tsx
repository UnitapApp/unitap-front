import React from 'react';

import Navbar from 'components/common/Navbar/navbar';
import { Row } from 'components/basic/Row/row';
import { Col } from 'components/basic/Col/col';
import ClaimModal from 'pages/home/components/ClaimModal/claimModal';
import BrightConnectionModal from 'pages/home/components/BrightConnectionModal/brightConnectionModal';
import Footer from 'components/common/Footer/footer';
import TokensList from './components/TokensList/TokensList';
import Header from './components/Header/Header';
import SearchInput from './components/SearchInput/searchInput';

const TokenTap = () => {
  return (
    <>
      <Navbar />
      <div className="content-wrapper">
        <div className="max-w-screen-xl m-auto flex flex-col justify-center items-center w-full py-4 px-6 lg:py-9 lg:px-20">
          <div className="row flex wrap w-full">
            <Header />
          </div>
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
