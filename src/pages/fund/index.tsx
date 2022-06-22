import React, { FC } from 'react';

import Navbar from 'components/common/Navbar/navbar';
import Content from './components/Content/content';
import Header from './components/Header/header';
import Footer from 'components/common/Footer/footer';

import { Body } from 'components/common/Body/body';
import { FundProvider } from 'hooks/useChainListFund';

const Fund: FC = () => {
  return (
    <>
      <FundProvider>
        <Navbar />
        <Body>
          <Header />
          <Content />
        </Body>
        <Footer />
      </FundProvider>
    </>
  );
};

export default Fund;
