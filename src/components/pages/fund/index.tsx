import React, { FC, useCallback } from 'react';
import styled from 'styled-components/';

import useActiveWeb3React from 'hooks/useActiveWeb3React';
import { injected } from 'connectors';

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
  const { activate } = useActiveWeb3React();
  const connect = useCallback(async () => {
    try {
      await activate(injected);
    } catch (ex) {
      console.log(ex);
    }
  }, [activate]);

  return (
    <>
      <NavWrapper>
        <Navbar handleConnect={connect} />
      </NavWrapper>
      <Header />
      <Content />
      <Footer />
    </>
  );
};

export default Fund;
