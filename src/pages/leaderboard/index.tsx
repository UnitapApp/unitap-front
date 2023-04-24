import React, { useState } from 'react';
import Navbar from 'components/common/Navbar/navbar';
import Header from './components/Header/header';

const Leaderboard = () => {
  return (
    <>
      <Navbar />
      <div className="content-wrapper">
        <div className="m-auto flex flex-col justify-center items-center w-full">
          <div className="flex wrap w-full">
            <Header />
          </div>
        </div>
      </div>
    </>
  );
};

export default Leaderboard;
