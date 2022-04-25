import React, { FC, useCallback, useEffect } from 'react';
import ChainList from './components/Chainlist/chainlist';
import Navbar from 'components/common/Navbar/navbar';

import { DV } from 'components/basic/designVariables';
import styled from 'styled-components/';
import Header from 'components/pages/home/components/Header/header';
import useActiveWeb3React from '../../../hooks/useActiveWeb3React';
import { injected } from '../../../connectors';
import { UserProfileProvider } from '../../../hooks/useUserProfile';

const NavWrapper = styled.div`
  position: absolute;
  width: 100%;
`;
const ChainListWrapper = styled.div`
  padding: ${DV.sizes.baseRadius * 8}px ${DV.sizes.baseRadius * 4}px;
`;

const Home: FC = ({ children }) => {
  const { activate, account } = useActiveWeb3React();

  const connect = useCallback(async () => {
    try {
      await activate(injected);
    } catch (ex) {
      console.log(ex);
    }
  }, [activate]);

  useEffect(() => {
    connect();
  }, [connect]);

  return (
    <UserProfileProvider address={account}>
      <NavWrapper>
        <Navbar handleConnect={connect} />
      </NavWrapper>
      <Header />
      <ChainListWrapper>
        <ChainList />
      </ChainListWrapper>
    </UserProfileProvider>
  );
};

export default Home;
