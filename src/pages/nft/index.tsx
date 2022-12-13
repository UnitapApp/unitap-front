import React from 'react';

import Navbar from 'components/common/Navbar/navbar';
import Header from './components/Header/Header';
import Footer from 'components/common/Footer/footer';

const NFT = () => {
  return (
    <>
      <Navbar />
      <div className='unitap-body'>
        <div className='max-w-screen-xl m-auto flex flex-col justify-center items-center w-full py-4 px-6 lg:py-9 lg:px-20'>
          <div className='flex wrap w-full'>
            <Header />
          </div>

          

        </div>
      </div>
      <Footer />
    </>
  )
}

export default NFT;