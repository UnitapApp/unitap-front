import React from 'react';
import styled from 'styled-components';

import ChainList from './components/Chainlist/chainlist';
import Navbar from 'components/common/Navbar/navbar';
import Header from 'pages/home/components/Header/header';
import Footer from '../../components/common/Footer/footer';
import ProvideGasCard from './components/ProvideGasCard/provideGasCard';

import { Body } from 'components/common/Body/body';
import { DV } from 'components/basic/designVariables';
import Timer from './components/Timer/timer';
import SearchInput from './components/SearchInput/searchInput';
import { Row } from 'components/basic/Row/row';
import { Col } from 'components/basic/Col/col';
import ClaimModal from './components/ClaimModal/claimModal';
import BrightConnectionModal from './components/BrightConnectionModal/brightConnectionModal';

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
            <Col xs={12} md={12} lg={6} xlg={6.5}>
              {/* <Timer /> */}
            </Col>
          </Row>
          <ChainList />
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
