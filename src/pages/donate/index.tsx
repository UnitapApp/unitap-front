import React, { useState } from 'react';

import Navbar from 'components/common/Navbar/navbar';
import Footer from '../../components/common/Footer/footer';

const Home = () => {
  const [networks] = useState([
    { name: 'Bitcoin', icon: 'btc.svg', isSelected: false },
    { name: 'Evm Networks', icon: 'eth.svg', isSelected: false },
    { name: 'Solana', icon: 'solana.svg', isSelected: false },
  ]);

  const [selectedNetwork, setSelectedNetwork] = useState(false);

  function selectNetwork() {
    setSelectedNetwork(!selectedNetwork);
    networks[0].isSelected = !selectedNetwork;
  }

  return (
    <>
      <Navbar />
      <div className={'unitap-body flex justify-center items-center px-4 py-8'}>
        <div className={'uni-card after:bg-donate-texture-p  after:w-60 after:top-0 after:h-56 px-4 py-6'}>
          <div className={'h-64 flex flex-col justify-end items-center'}>
            {selectedNetwork && <p className={'text-white font-semibold text-lg z-10 relative'}>Unitap Wallet</p>}
            <img
              src={`/assets/images/donate/${selectedNetwork ? 'qr.svg' : 'donate-img.png'}`}
              className={'mb-12 m-auto z-10'}
            />
          </div>
          <h2 className={'text-white mb-4'}>Donate to Unitap</h2>

          <p className={'text-gray100 mb-8 text-xs'}>
            Select a network to view Unitap wallet address and easily donate to Unitap.
          </p>
          <label className={'text-gray90 text-xs mb-2 inline-block'}>Select network</label>
          <div className={'flex flex-col sm:flex-row justify-between gap-2 '}>
            {networks.map((network) => (
              <div
                onClick={selectNetwork}
                key={network.name}
                className={`${
                  network.isSelected
                    ? 'gradient-outline-button bg-gray00 before:rounded-[11px] before:inset-[0.1rem] '
                    : 'border-gray50 bg-gray30 border-2'
                } sm:w-36 cursor-pointer  text-white rounded-xl transition-colors hover:bg-gray00 duration-200 flex gap-2 flex-col justify-center items-center px-2 py-3`}
              >
                <img src={`/assets/images/donate/${network.icon}`} />
                <p className={'text-xs'}>{network.name}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Home;
