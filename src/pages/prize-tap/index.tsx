import React from 'react';

import Header from './components/Header/header';
import Navbar from 'components/common/Navbar/navbar';
import Footer from 'components/common/Footer/footer';
import RafflesList from './components/RafflesList/RafflesList';
import EnrollModal from './components/EnrollModal';
import BrightConnectionModal from 'pages/home/components/BrightConnectionModal/brightConnectionModal';

const PrizeTap = () => {
  return (
    <div className="prize-tap">
      <Navbar />
      <div className="content-wrapper">
        <Header />
        <RafflesList />
      </div>
      <Footer />
      <EnrollModal />
      <BrightConnectionModal />
    </div>
  );
};

export default PrizeTap;
