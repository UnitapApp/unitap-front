import React, { useState } from 'react';

import Navbar from 'components/common/Navbar/navbar';
import Header from './components/Header/Header';
import Footer from 'components/common/Footer/footer';
import Collapse from './components/Collapse/Collapse';
import NFTTimer from './components/NFTTimer/nftTimer';
import MintNFTCard from './components/MintNFTCard/mintNftCard';

const NFT = () => {
  const [isPreLaunch, setIsPreLaunch] = useState(true);

  return (
    <>
      <Navbar />
      <div className="unitap-body">
        <div className="max-w-screen-xl m-auto flex flex-col justify-center items-center w-full py-4 px-6 lg:py-9 lg:px-20">
          <div className="flex wrap w-full">
            <Header />
          </div>
          <div className="flex flex-col md:flex-row wrap w-full gap-4 mb-4">
            <div className="card md:w-7/12">
              <p className="title font-bold mb-4">Unitap Pass Benefits</p>
              <p className="subtitle text-sm leading-7 font-light">
                Unitap Passes work with Prize Tap, an upcoming feature for Unitap. Unitap Pass holders will receive the
                following benefits:
              </p>
              <ul className="text-sm list-disc pl-4 leading-7 font-light mb-12">
                <li className="">
                  Unitap Pass holders won’t have to visit the Unitap App to claim entries. Unitap will deliver free
                  entries to each Pass holder’s wallet address each period, with no gas or interaction needed.
                </li>
                <li className="">
                  Unitap Pass holders will receive more entries than basic users. The more Unitap Passes someone holds,
                  the more entries they will have automatically delivered to them: one additional entry per Unitap Pass.
                </li>
                <li className="">
                  Unitap Passes are minted on Ethereum mainnet, but we can deliver offerings to the same address on
                  other networks. We can also have the user sign a message (gasless) specifying their preferred delivery
                  address on another network.
                </li>
              </ul>
              <p className="text-gradient-primary text-sm font-semibold">
                As Unitap adds taps and features,<br />
                we will offer new benefits to Unitap Pass holders.
              </p>
            </div>
            {isPreLaunch ? (
              <div className="card md:w-5/12 p-2" onClick={() => setIsPreLaunch(!isPreLaunch)}>
                <NFTTimer className="mb-14" />
                <img
                  className={'w-52 animate-rocket m-auto relative right-3'}
                  src={'/assets/images/nft/rocketship.png'}
                />
                <img className={'w-44 m-auto'} src={'/assets/images/nft/rocket-base.png'} />
              </div>
            ) : (
              <div className="card md:w-5/12 p-0 h-full overflow-hidden">
                <MintNFTCard />
              </div>
            )}
          </div>
          <Collapse className="mb-4" title="Unitap Pass Sale" icon="assets/images/nft/nft-pass-sale-icon.svg">
            <>
              <p className="collapse-text">
                10,000 Unitap Passes total will be sold for .1 Eth each using a small batch sale and a BrightID Aura
                gated sale.
              </p>
              <p className="collapse-title">Small batch sale</p>
              <p className="collapse-text">
                A maximum of 2,000 Unitap Passes will be sold in small batches, with a starting batch size of 100.
                Anyone can buy Passes up to the number left in the current batch. When a batch sells out, Unitap will
                decide whether to start a new batch or to transition to the Aura gated sale.
              </p>
              <p className="collapse-title">Aura gated sale</p>
              <p className="collapse-text">
                The remaining Unitap Passes will be sold gated by BrightID Aura verification. Anyone with Aura
                verification can deposit Eth to automatically purchase one Unitap Pass per day while supplies last.
              </p>
            </>
          </Collapse>
          <Collapse className="mb-4" title="Questions" icon="assets/images/nft/nft-questions-icon.svg">
            <>
              <p className="collapse-title">Will Unitap Passes contribute to wealth disparity?</p>
              <p className="collapse-text mb-8">
                No. Unitap strives to provide immense value to every person for free. Even if Unitap Passes are worth
                much more than their purchase price, the value one person will get from holding multiple Passes will not
                exceed the immense value each person will receive from Unitap for free.
              </p>
              <p className="collapse-title">Where will the money go?</p>
              <p className="collapse-text">
                All money received from the sale of Unitap Passes will go to support Unitap and BrightID (a core
                component of Unitap). Unitap has chosen to use Bright DAO for its govenance and will make proposals to
                receive $BRIGHT as needed to pay for its operations. Any money raised that exceeds the immediate needs
                of the Unitap team will be used to buy $BRIGHT tokens and deposit them in Bright DAO’s community pool.
                Bright DAO is a large community Gardens DAO with over 1400 members.
              </p>
            </>
          </Collapse>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default NFT;
