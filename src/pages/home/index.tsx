import React, { FC, useCallback } from 'react';
import ChainList from './components/Chainlist/chainlist';
import Navbar from 'components/common/Navbar/navbar';
import styled from 'styled-components/';
import Header from './components/Header/header';
import useActiveWeb3React from 'hooks/useActiveWeb3React';
import { injected } from 'connectors';
import { UserProfileProvider } from 'hooks/useUserProfile';
import { ChainListProvider } from 'hooks/useChainList';

const NavWrapper = styled.div`
  position: absolute;
  width: 100%;
  z-index: 2;
`;

const Home: FC = () => {
  const { activate, account } = useActiveWeb3React();
  const connect = useCallback(async () => {
    try {
      await activate(injected);
    } catch (ex) {
      console.log(ex);
    }
  }, [activate]);

  return (
    <UserProfileProvider address={account}>
      <ChainListProvider address={account}>
        <NavWrapper>
          <Navbar handleConnect={connect} />
        </NavWrapper>
        <Header />
        <ChainList />
      </ChainListProvider>
    </UserProfileProvider>
  );
};

export default Home;
