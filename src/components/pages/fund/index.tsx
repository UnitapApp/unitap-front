import React, { FC, useCallback } from 'react';
import Navbar from 'components/common/Navbar/navbar';
import Header from './components/Header/header';
import useActiveWeb3React from 'hooks/useActiveWeb3React';
import { injected } from 'connectors';

import styled from 'styled-components/';
import Icon from 'components/basic/Icon/Icon';
import { Footer } from './index.style';
import Content from './components/Content/content';

const NavWrapper = styled.div`
  position: absolute;
  width: 100%;
  z-index: 2;
`;

const Fund: FC = () => {
  const { activate, account } = useActiveWeb3React();
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

      <Footer>
        <Icon iconSrc={'assets/images/fund/footer-text.png'} width="100%"></Icon>
      </Footer>
    </>
  );
};

export default Fund;
