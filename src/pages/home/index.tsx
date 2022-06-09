import React from 'react';
import ChainList from './components/Chainlist/chainlist';
import Navbar from 'components/common/Navbar/navbar';
import styled from 'styled-components/';
import Header from 'pages/home/components/Header/header';
import Footer from '../../components/common/Footer/footer';

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
      <Footer />
    </>
  );
};

export default Home;
