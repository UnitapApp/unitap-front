import React, { FC, useContext, useMemo, useState } from 'react';
import Navbar from 'components/common/Navbar/navbar';
import Widget from './components/widget';
import UButton from '../../components/basic/Button/UButton';
import RoutePath from 'routes';
import { useNavigate } from 'react-router-dom';
import { sortChainListByTotalClaimWeekly } from 'utils/hook/sortChainList';
import { ClaimContext } from 'hooks/useChainList';

const Landing: FC = () => {
  const { chainList } = useContext(ClaimContext);

  const sortedChainList = useMemo(() => sortChainListByTotalClaimWeekly(chainList), [chainList]);

  const [socialLinks] = useState([
    {
      img: 'twitter-icon.svg',
      localClass: 'hover:bg-light-space-green sm:rounded-l-2xl',
      link: 'http://twitter.com/unitap_app',
    },
    {
      img: 'github-icon.svg',
      localClass: 'hover:bg-blue-200',
      link: 'https://github.com/UnitapApp',
    },
    {
      img: 'discord-icon.svg',
      localClass: 'hover:bg-purple-200',
      link: 'https://discord.gg/kH8WeQ6tuF',
    },
  ]);
  const [stats] = useState([
    { name: 'EVM Networks', number: 10 },
    { name: 'Non-EVM Networks', number: 12 },
    { name: 'Test Networks', number: 3 },
    { name: 'Gas Fees Claimed', number: '7,324' },
  ]);
  const [futureTaps] = useState([
    { name: 'Learn Tap', description: 'Where users can learn to user web 3 technologies' },
    { name: 'Stake Tap', description: 'Where users can learn to user web 3 technologies' },
    { name: 'Launch Tap', description: 'Where users can learn to user web 3 technologies' },
  ]);

  const navigate = useNavigate();

  return (
    <>
      <Navbar />
      <main className={'flex flex-col gap-6 px-4 sm:px-6 lg:px-8 xl1440:px-60 xl:px-40 py-24 max-w-screen-2xl m-auto'}>
        <section
          id="home-header"
          className={
            'uni-card flex flex-col gap-4 after:rounded-2xl after:bg-home-header-texture h-44 text-white justify-center pl-12'
          }
        >
          <h1 className={'font-bold text-4xl'}>UNITAP</h1>
          <h4>A gateway to Networks and Communities.</h4>
        </section>

        {/* <section
          id="home-nft"
          className={
            'items-center px-12 md:flex-row flex-col gap-4 md:gap-0 uni-card py-10 after:inset-auto after:left-0 after:top-0 after:w-32 after:h-24 flex justify-between after:rounded-2xl after:bg-nft-texture text-white'
          }
        >
          <div className={'flex gap-4 md:flex-row flex-col items-center justify-center'}>
            <h3 className={'font-bold text-2xl text-gradient-primary'}>Mint Unitap Genesis Pass NFT</h3>
            <p>1,136 / 2,000 Minted</p>
          </div>
          <div>
            <UButton className={'gradient-outline-button'}>Go to Mint Page</UButton>
          </div>
        </section> */}

        <section id="home-taps" className={'flex lg:flex-row flex-col gap-4 justify-between'}>
          <Widget
            description={'Claim gas fees for any reason and make  transactions easily'}
            icon={'gastap-icon.svg'}
            className={'after:bg-gastap-texture flex-1'}
            title={'Gas Tap'}
            buttonTitle={'Go to Tap'}
            onButtonClick={() => navigate(RoutePath.FAUCET)}
          >
            {sortedChainList.length > 0 && (
              <>
                <p className={'font-semibold text-sm text-white mb-2.5 mt-6'}>Weekly Ranking</p>
                <ul className={'text-white'}>
                  {sortedChainList.slice(0, 3).map((token, index) => (
                    <li
                      key={token.chainId}
                      className={'flex text-xs bg-gray30 rounded-xl py-3 px-3 items-center justify-between mb-2'}
                    >
                      <div className={'flex gap-2 items-center'}>
                        <p>#{index + 1}</p>
                        <span className="token-logo-container w-6 h-6 flex items-center justify-center">
                          <img src={token.logoUrl} alt={token.chainName} className="token-logo w-auto h-[100%]" />
                        </span>
                        <p>{token.chainName}</p>
                      </div>
                      <p>
                        {token.totalClaimsSinceLastMonday} <span>claims</span>
                      </p>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </Widget>

          <Widget
            description={'Where everyone can claim any kind of tokens such as community tokens, NFTs, UBI tokens'}
            icon={'tokentap-icon.svg'}
            className={'after:bg-tokentap-texture flex-1'}
            title={'Token Tap'}
            buttonTitle={'Go to Tap'}
            onButtonClick={() => navigate(RoutePath.TOKEN)}
          >
            <UButton
              className={'green-text-button inline-flex py-1.5 px-2.5 mt-[182px]'}
              buttonClassName="cursor-default"
            >
              Beta
            </UButton>
          </Widget>

          <Widget
            description={'Where everyone has chances to win larger prizes'}
            className={'flex-1'}
            title={'Prize Tap'}
            buttonTitle={'Soon...'}
            buttonClass={'secondary-button'}
          ></Widget>
        </section>

        <section id={'home-future-taps'} className={'flex gap-4 justify-between md:flex-row flex-col'}>
          {futureTaps.map((tap) => (
            <Widget
              key={tap.name}
              description={tap.description}
              className={'flex-1'}
              title={tap.name}
              buttonTitle={'Soon...'}
              buttonClass={'secondary-button'}
            ></Widget>
          ))}
        </section>

        <section id="home-stats" className={'flex gap-4 justify-between'}>
          <Widget
            className={
              'flex-1 !pb-7 !pt-5 px-20 after:bg-stats-texture after:inset-auto after:left-0 after:top-0 after:w-36 after:h-28'
            }
            title={'Unitap Stats'}
            titleClass={'!justify-center'}
          >
            <div className={'flex justify-between mt-4 md:flex-row flex-col gap-4 md:gap-0'}>
              {stats.map((stat) => (
                <div key={stat.name} className={'flex flex-col gap-2 items-center'}>
                  <p className={'text-xl text-space-green font-semibold'}>{stat.number}</p>
                  <p className={'text-gradient-primary text-xs font-medium'}>{stat.name}</p>
                </div>
              ))}
            </div>
          </Widget>
        </section>
        <section id="home-footer" className={'flex gap-4 md:flex-row flex-col'}>
          <div
            className={
              'uni-card cursor-pointer md:w-1/3 h-36 after:bg-donate-texture after:inset-auto after:right-0 after:top-0 after:w-28 after:h-36 flex justify-center items-center'
            }
            onClick={() => navigate(RoutePath.DONATE)}
          >
            <h2 className={'text-white'}>Donate to Unitap</h2>
          </div>
          <div className={'md:w-2/3 md:h-36 uni-card after:inset-auto flex sm:flex-row flex-col gap-4 sm:gap-0'}>
            {socialLinks.map((social) => (
              <div
                onClick={() => window.open(social.link, '_blank')}
                key={social.link}
                className={`${social.localClass} flex justify-center items-center cursor-pointer px-8 border-b-3 md:border-b-0 md:border-r-3 py-6 sm:py-0 border-gray40 transition duration-300 ease-in-out`}
              >
                <img src={`/assets/images/landing/${social.img}`} />
              </div>
            ))}

            <div className={'flex flex-grow justify-center items-center text-white py-6 sm:py-0'}>
              <h2>Community</h2>
            </div>
          </div>
        </section>
      </main>
    </>
  );
};

export default Landing;
