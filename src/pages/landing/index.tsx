import React, { FC, useState } from 'react';
import Navbar from 'components/common/Navbar/navbar';
import Widget from './components/widget';
import UButton from '../../components/basic/Button/UButton';

const Landing: FC = () => {
  const [tokenList, setTokenList] = useState([1, 2, 3]);
  return (
    <>
      <Navbar />
      <main className={'flex flex-col gap-6 px-4 sm:px-6 lg:px-8 xl1440:px-60 xl:px-40 py-24 max-w-screen-2xl m-auto'}>
        <section
          id="home-header"
          className={
            'home-widget flex flex-col gap-4 after:rounded-2xl after:bg-home-header-texture h-44 text-white justify-center pl-12'
          }
        >
          <h1 className={'font-bold text-4xl'}>UNITAP</h1>
          <h4>A gateway to Networks and Communities.</h4>
        </section>

        <section
          id="home-nft"
          className={
            'items-center px-12 home-widget py-6 after:inset-auto after:left-0 after:top-0 after:w-32 after:h-24 flex justify-between after:rounded-2xl after:bg-nft-texture text-white'
          }
        >
          <div className={'flex flex-col gap-4 justify-center'}>
            <h3 className={'font-bold text-2xl text-gradient-primary'}>Mint Unitap Genesis Pass NFT</h3>
            <p>1,136 / 2,000 Minted</p>
          </div>
          <div>
            <UButton className={'gradient-outline-button'}>Go to Mint Page</UButton>
          </div>
        </section>

        <section id="home-taps" className={'flex lg:flex-row flex-col gap-4 justify-between'}>
          <Widget
            description={'Claim gas fees for any reason and make  transactions easily'}
            icon={'gastap-icon.svg'}
            className={'after:bg-gastap-texture flex-1'}
            title={'Gas Tap'}
            buttonTitle={'Go to Tap'}
          >
            <p className={'font-semibold text-sm text-white mb-2.5 mt-6'}>Weekly Ranking</p>
            <ul className={'text-white'}>
              {tokenList.map((token) => (
                <li
                  key={token}
                  className={'flex text-xs bg-dark-gray-4 rounded-xl py-3 px-3 items-center justify-between mb-2'}
                >
                  <div className={'flex gap-2 items-center'}>
                    <p>#1</p>
                    <img src={'/assets/images/tokens/fantom.svg'} />
                    <p>Fantom</p>
                  </div>
                  <p>
                    1,377 <span>claims</span>
                  </p>
                </li>
              ))}
            </ul>
          </Widget>

          <Widget
            description={'Where everyone can claim any kind of tokens such as community tokens, NFTs, UBI tokens'}
            icon={'tokentap-icon.svg'}
            className={'after:bg-tokentap-texture flex-1'}
            title={'Token Tap'}
            buttonTitle={'Go to Tap'}
          >
            <UButton className={'green-text-button inline-flex py-1.5 px-2.5 mt-[182px]'}>Beta</UButton>
          </Widget>

          <Widget
            description={'Where everyone has chances to win larger prizes'}
            className={'flex-1'}
            title={'Prize Tap'}
            buttonTitle={'Soon...'}
            buttonClass={'secondary-button'}
          ></Widget>
        </section>

        <section id={'home-future-taps'} className={'flex gap-4 justify-between '}>
          <Widget
            description={'Where users can learn to user web 3 technologies'}
            className={'flex-1'}
            title={'Learn Tap'}
            buttonTitle={'Soon...'}
            buttonClass={'secondary-button'}
          ></Widget>

          <Widget
            description={'Where users can learn to user web 3 technologies'}
            className={'flex-1'}
            title={'Stake Tap'}
            buttonTitle={'Soon...'}
            buttonClass={'secondary-button'}
          ></Widget>

          <Widget
            description={'Where users can learn to user web 3 technologies'}
            className={'flex-1'}
            title={'Launch Tap'}
            buttonTitle={'Soon...'}
            buttonClass={'secondary-button'}
          ></Widget>
        </section>

        <section id="home-stats" className={'flex gap-4 justify-between'}>
          <Widget
            className={
              'flex-1 !pb-7 !pt-5 px-20 after:bg-stats-texture after:inset-auto after:left-0 after:top-0 after:w-36 after:h-28'
            }
            title={'Unitap Stats'}
            titleClass={'!justify-center'}
          >
            <div className={'flex justify-between mt-4'}>
              <div className={'flex flex-col gap-2 items-center'}>
                <p className={'text-xl text-space-green font-semibold'}>10</p>
                <p className={'text-gradient-primary text-xs font-medium'}>EVM Networks</p>
              </div>
              <div className={'flex flex-col gap-2 items-center'}>
                <p className={'text-xl text-space-green font-semibold'}>10</p>
                <p className={'text-gradient-primary text-xs font-medium'}>Non-EVM Networks</p>
              </div>
              <div className={'flex flex-col gap-2 items-center'}>
                <p className={'text-xl text-space-green font-semibold'}>10</p>
                <p className={'text-gradient-primary text-xs font-medium'}>Test Networks</p>
              </div>
              <div className={'flex flex-col gap-2 items-center'}>
                <p className={'text-xl text-space-green font-semibold'}>7,324</p>
                <p className={'text-gradient-primary text-xs font-medium'}>Gas Fees Claimed</p>
              </div>
            </div>
          </Widget>
        </section>
        <section id="home-footer" className={'flex gap-4'}>
          <div
            className={
              'home-widget w-1/3 h-36 after:bg-donate-texture after:inset-auto after:right-0 after:top-0 after:w-28 after:h-36 flex justify-center items-center'
            }
          >
            <h2 className={'text-white'}>Donate to UNITAP</h2>
          </div>
          <div className={'w-2/3 home-widget after:inset-auto flex'}>
            <div
              className={
                'flex justify-center items-center cursor-pointer px-8 border-r-3 border-dark-gray-6 rounded-l-2xl hover:bg-light-space-green transition duration-300 ease-in-out'
              }
            >
              <img src={'/assets/images/landing/twitter-icon.svg'} />
            </div>
            <div
              className={
                'flex justify-center items-center cursor-pointer px-8 border-r-3 border-dark-gray-6 hover:bg-blue-200 transition duration-300 ease-in-out'
              }
            >
              <img src={'/assets/images/landing/github-icon.svg'} />
            </div>
            <div
              className={
                'flex justify-center items-center cursor-pointer px-8 border-r-3 border-dark-gray-6 hover:bg-purple-200 transition duration-300 ease-in-out'
              }
            >
              <img src={'/assets/images/landing/discord-icon.svg'} />
            </div>
            <div className={'flex flex-grow justify-center items-center text-white'}>
              <h2>Community</h2>
            </div>
          </div>
        </section>
      </main>
    </>
  );
};

export default Landing;
