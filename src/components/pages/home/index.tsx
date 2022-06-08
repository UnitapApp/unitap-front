import React from 'react';
import ChainList from './components/Chainlist/chainlist';
import Navbar from 'components/common/Navbar/navbar';
import styled from 'styled-components/';
import Header from 'components/pages/home/components/Header/header';

const NavWrapper = styled.div`
  position: absolute;
  width: 100%;
  z-index: 11;
`;

const Home = () => {
  return (
    <>
      <NavWrapper>
        <Navbar />
      </NavWrapper>
      <Header />
      <ChainList />
    </>
  );
};

export default Home;
