import React, { FC } from 'react';
import styled from 'styled-components/';

import Navbar from 'components/common/Navbar/navbar';
import Content from './components/Content/content';
import Header from './components/Header/header';
import Footer from 'components/common/Footer/footer';

const NavWrapper = styled.div`
  position: absolute;
  width: 100%;
  z-index: 2;
`;

const Fund: FC = () => {
  return (
    <>
      <NavWrapper>
        <Navbar />
      </NavWrapper>
      <Header />
      <Content />
      <Footer />
    </>
  );
};

export default Fund;