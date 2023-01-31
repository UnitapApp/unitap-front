import React, { FC, useContext, useEffect, useMemo, useState } from 'react';
import Navbar from 'components/common/Navbar/navbar';
import Widget from './components/widget';
import UButton from '../../components/basic/Button/UButton';
import RoutePath from 'routes';
import { Link, useNavigate } from 'react-router-dom';
import { sortChainListByTotalClaimWeekly } from 'utils/hook/sortChainList';
import { ClaimContext } from 'hooks/useChainList';
import { useUnitapBatchSale } from 'hooks/pass/useUnitapBatchSale';
import { getTotalGasFeeClaims, getTotalTestNetworks } from 'utils';
import { getTotalEVMNetworks } from '../../utils';

const Landing: FC = () => {
  const { chainList } = useContext(ClaimContext);

  const sortedChainList = useMemo(() => sortChainListByTotalClaimWeekly(chainList), [chainList]);

  const { batchSoldCount, batchSize } = useUnitapBatchSale();

  const maxCount = useMemo(() => batchSize || 0, [batchSize]);
  const remainingCount = useMemo(() => (maxCount ? maxCount - (batchSoldCount || 0) : 0), [maxCount, batchSoldCount]);

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
      link: 'https://discord.gg/unitap',
    },
  ]);
  const [stats, setStats] = useState([
    { name: 'Unitap Users', number: '856' },
    { name: 'EVM Networks', number: 0 },
    { name: 'Test Networks', number: 0 },
    { name: 'Gas Fees Claimed', number: getTotalGasFeeClaims(chainList) },
  ]);

  useEffect(() => {
    setStats((prev) => [
      { name: 'Unitap Users', number: '856' },
      { name: 'EVM Networks', number: getTotalEVMNetworks(chainList) },
      { name: 'Test Networks', number: getTotalTestNetworks(chainList) },
      { name: 'Gas Fees Claimed', number: getTotalGasFeeClaims(chainList) },
    ]);
  }, [chainList]);

  const [futureTaps] = useState([
    {
      name: 'Learn Tap',
      icon: 'learntap-icon.png',
      description: 'Where users can learn to use web 3 technologies',
      class: '',
      iconSize: 'w-6',
    },
    {
      name: 'Stake Tap',
      icon: 'staketap-icon.png',
      description: 'A public good staking platform where users can earn rewards by staking their assets',
      class: 'after:bg-staketap-texture after:inset-auto after:!right-0 after:!bottom-0 after:w-28 after:h-20',
      iconSize: 'w-7 h-8',
    },
    {
      name: 'Launch Tap',
      icon: 'launchtap-icon.png',
      description: 'A public good launch pad where every unique human will benefit from each launch through Prize Tap',
      class: 'after:bg-launchtap-texture after:right-0 after:w-28',
      iconSize: 'w-6',
    },
  ]);

  const deadline = useMemo(() => new Date('January 12, 2023 16:00:00 UTC'), []);

  const navigate = useNavigate();

  return (
    <>
      <Navbar />
      <main className={'flex flex-col gap-6 content-wrapper'}>
        <section
          id="home-header"
          className={
            'uni-card flex flex-col gap-4 after:rounded-2xl after:bg-home-header-texture h-40 text-white justify-center text-center sm:text-left sm:px-12 overflow-hidden'
          }
        >
          <img src={'/assets/images/landing/uni-logo.svg'} className={'w-48 mx-auto sm:mx-0'} alt={'logo'} />
          <h4 className={'text-gradient-primary'}>
            Unitap is an onboarding tool for networks and communities and a gateway for users to web3
          </h4>
        </section>

        <section
          id="home-nft"
          className={
            'items-center px-12 text-center sm:text-left md:flex-row flex-col gap-4 md:gap-0 uni-card py-3 ' +
            'after:inset-auto after:left-0 after:-top-10 after:w-36 after:h-32 flex justify-between ' +
            'after:rounded-2xl after:bg-nft-texture text-white hover:bg-gray00 cursor-pointer hover:after:top-2'
          }
          onClick={() => navigate(RoutePath.NFT)}
        >
          <div className={'flex gap-4 flex-col items-start card-text justify-center'}>
            <h3 className={'font-bold text-2xl text-gradient-primary'}>Mint Unitap Pass NFT</h3>
            {maxCount > 0 && (
              <p className={'text-gray100'}>
                {deadline < new Date() && (
                  <>
                    <span className={'text-white'}>{remainingCount}</span> of{' '}
                    <span className={'text-white'}>{maxCount}</span> Passes are left in the current batch. Mint your
                    Passes now
                  </>
                )}
              </p>
            )}
          </div>
          <div>
            <UButton size={'btn-large'} className={'secondary-button'} icon={'/assets/images/landing/arrow-right.svg'}>
              Go to Mint Page
            </UButton>
          </div>
        </section>

        <section id="home-taps" className={'flex lg:flex-row min-h-[360px] flex-grow flex-col gap-4 justify-between'}>
          <Link className={'flex--1'} to={RoutePath.FAUCET}>
            <Widget
              description={'Claim gas fees for any reason and make  transactions easily'}
              icon={'gastap-icon.svg'}
              iconSize={'w-7'}
              className={'after:bg-gastap-texture hover:bg-gray00 cursor-pointer h-full'}
              title={'Gas Tap'}
              buttonTitle={'Go to Tap'}
              buttonClass={'gradient-outline-button'}
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
          </Link>

          <section className={'flex--1'}>
            <Widget
              description={'Where everyone can claim any kind of tokens such as community tokens, NFTs, UBI tokens'}
              icon={'tokentap-icon.svg'}
              iconSize={'w-8'}
              className={'h-full after:bg-tokentap-texture flex-1 '}
              title={'Token Tap'}
              buttonTitle={'Soon...'}
              buttonClass={'secondary-button !bg-gray30'}
            ></Widget>
          </section>

          <section className={'flex--1'}>
            <Link className={'flex--1'} to={RoutePath.PRIZE}>
              <Widget
                description={'Where everyone has chances to win larger prizes'}
                className={'after:bg-prizetap-texture h-full after:w-full after:-top-8 hover:bg-gray00'}
                icon={'prizetap-icon.png'}
                iconSize={'w-8 h-7'}
                title={'Prize Tap'}
                buttonTitle={'Go to Tap'}
                buttonClass={'gradient-outline-button'}
              ></Widget>
            </Link>
          </section>
        </section>

        <section id={'home-future-taps'} className={'flex gap-4 justify-between md:flex-row flex-col'}>
          {futureTaps.map((tap) => (
            <Widget
              icon={tap.icon}
              iconSize={tap.iconSize}
              key={tap.name}
              description={tap.description}
              className={`${tap.class} flex-1 pb-12`}
              title={tap.name}
              unClickable
              buttonTitle={'Soon...'}
              buttonClass={'secondary-button !bg-gray30'}
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
              'uni-card hover:bg-gray00 hover:after:top-3 cursor-pointer md:w-1/3 h-36 after:bg-donate-texture after:inset-auto ' +
              'after:right-0 after:top-0 after:w-28 after:h-36 flex justify-center items-center'
            }
            onClick={() => navigate(RoutePath.DONATE)}
          >
            <h2 className={'text-white card-text'}>Donate to Unitap</h2>
          </div>
          <div className={'md:w-2/3 md:h-36 uni-card after:inset-auto flex sm:flex-row flex-col gap-4 sm:gap-0'}>
            {socialLinks.map((social) => (
              <div
                onClick={() => window.open(social.link, '_blank')}
                key={social.link}
                className={`${social.localClass} flex home-footer-social-link cursor-pointer justify-center items-center cursor-pointer px-8 border-b-3 md:border-b-0 md:border-r-3 py-6 sm:py-0 border-gray40 transition duration-300 ease-in-out`}
              >
                <img className={''} src={`/assets/images/landing/${social.img}`} />
              </div>
            ))}

            <div
              onClick={() => navigate(RoutePath.ABOUT)}
              className={
                'uni-card hover:bg-gray00 hover:after:top-4 cursor-pointer after:bg-what-is-unitap after:left-auto after:!right-0 after:w-44 after:h-36' +
                ' flex flex-grow justify-center items-center text-white py-6 sm:py-0 rounded-tl-none rounded-bl-none'
              }
            >
              <h2 className={'card-text'}>What is Unitap ?</h2>
            </div>
          </div>
        </section>
      </main>
    </>
  );
};

export default Landing;
