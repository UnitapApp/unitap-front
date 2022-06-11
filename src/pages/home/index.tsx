import React from 'react';

import ChainList from './components/Chainlist/chainlist';
import Navbar from 'components/common/Navbar/navbar';
import Header from 'pages/home/components/Header/header';
import Footer from '../../components/common/Footer/footer';

import { Body } from 'components/common/Body/body';

const Home = () => {
  return (
    <>
      <Navbar />
      <Body>
        <Header />
        <ChainList />
      </Body>
      <Footer />
    </>
  );
};

export default Home;
