import React from 'react';

import Navbar from 'components/common/Navbar/navbar';
import Header from './components/Header/Header';
import Footer from 'components/common/Footer/footer';
import Icon from 'components/basic/Icon/Icon';
import Collapse from './components/Collapse/Collapse';

const NFT = () => {
  return (
    <>
      <Navbar />
      <div className='unitap-body'>
        <div className='max-w-screen-xl m-auto flex flex-col justify-center items-center w-full py-4 px-6 lg:py-9 lg:px-20'>
          <div className='flex wrap w-full'>
            <Header />
          </div>
          <div className='flex wrap w-full gap-x-4 mb-4'>
            <div className='card md:w-7/12'>
              <p className='title font-bold mb-4'>Unitap Pass Benefits</p>
              <p className='subtitle text-sm leading-7 font-light'>Unitap Passes work with Prize Tap, an upcoming feature for Unitap.
                Unitap Pass holders will receive the following benefits:</p>
              <ul className='text-sm list-disc pl-4 leading-7 font-light mb-12'>
                <li className=''>Unitap Pass holders won’t have to visit the Unitap App to claim entries. Unitap will deliver free entries to each Pass holder’s wallet address each period, with no gas or interaction needed.</li>
                <li className=''>Unitap Pass holders will receive more entries than basic users. The more Unitap Passes someone holds, the more entries they will have automatically delivered to them: one additional entry per Unitap Pass.</li>
                <li className=''>Unitap Passes are minted on Ethereum mainnet, but we can deliver offerings to the same address on other networks. We can also have the user sign a message (gasless) specifying their preferred delivery address on another network.</li>
              </ul>
              <p className='text-gradient-primary text-xs font-medium'>As Unitap adds taps and features, we will offer new benefits to Unitap Pass holders.</p>
            </div>
            <div className='card md:w-5/12'>
              <p className='title font-semibold text-xl mb-2'>02 : 23 : 58 : 03</p>
              <p className='subtitle text-sm leading-7 font-medium text-gray100 mb-16'>To Launch</p>
              <Icon iconSrc='assets/images/nft/launch-spaceship.svg' />
            </div>
          </div>
          <Collapse className="mb-4" title='Unitap Pass Sale' icon="assets/images/nft/nft-pass-sale-icon.svg"></Collapse>
          <Collapse className="mb-4" title='Questions' icon="assets/images/nft/nft-questions-icon.svg"></Collapse>
        </div>
      </div>
      <Footer />
    </>
  )
}

export default NFT;