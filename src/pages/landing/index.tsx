import React, { FC } from 'react';
import Navbar from 'components/common/Navbar/navbar';
import Widget from './components/widget';

const Landing: FC = () => {
  return (
    <>
      <Navbar />
      <main className={'flex flex-col gap-4 px-4 sm:px-6 lg:px-8 xl:px-60 py-24 max-w-screen-2xl m-auto'}>
        <section
          id="home-header"
          className={'home-widget after:rounded-2xl after:bg-home-header-texture h-44 text-white'}
        >
          <h2>UNITAP</h2>
          <h3>A gateway to Networks and Communities.</h3>
        </section>
        <section id="home-taps" className={'flex gap-4 justify-between'}>
          <Widget
            description={'Claim gas fee for no reseon and make 563456678 transactions easily'}
            icon={'gastap-icon.svg'}
            className={'after:bg-gastap-texture'}
            title={'Gas Tap'}
            buttonTitle={'Go to Tap'}
          ></Widget>
          <Widget
            description={'Claim gas fee for no reseon and make 563456678 transactions easily'}
            icon={'gastap-icon.svg'}
            className={'after:bg-gastap-texture'}
            title={'Gas Tap'}
            buttonTitle={'Go to Tap'}
          ></Widget>
          <Widget
            description={'Claim gas fee for no reseon and make 563456678 transactions easily'}
            icon={'gastap-icon.svg'}
            className={'after:bg-gastap-texture'}
            title={'Gas Tap'}
            buttonTitle={'Go to Tap'}
          ></Widget>
        </section>
        <section id="home-stats"></section>
        <section id="home-footer"></section>
      </main>
    </>
  );
};

export default Landing;
