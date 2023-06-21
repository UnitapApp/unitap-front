import React, { useEffect, useMemo, useState } from 'react';

import { Prize } from 'types';

import Navbar from 'components/common/Navbar/navbar';
import Header from './components/Header/header';
import Icon from 'components/basic/Icon/Icon';
import { ClaimButton } from 'components/basic/Button/button';
import Footer from 'components/common/Footer/footer';
import axios from 'axios';

const PrizeTap = () => {
  return (
    <div className="prize-tap">
      <Navbar />
      <div className="content-wrapper">
        <Header />
        <PrizesList />
      </div>
      <Footer />
    </div>
  );
};

const PrizesList = () => {
  const [prizes, setPrizes] = useState<Prize[]>([]);
  useEffect(() => {
    const controller = new AbortController();
    axios
      .get<Prize[]>('https://stage.unitap.app/api/prizetap/raffle-list/', { signal: controller.signal })
      .then((res) => {
        setPrizes(res.data);
        console.log(res.data);
      })
      .catch((err) => {
        if (err.message == 'canceled') return;
        console.log(err);
      });

    return () => controller.abort();
  }, []);
  // const [prizes] = useState([
  //   {
  //     pk: 1,
  //     image: 'assets/images/prize-tap/prize-image-1-2.svg',
  //     background: 'assets/images/prize-tap/prize-background-1.svg',
  //     title: 'SPACEMAN DELIVERY #100',
  //     enrolled: 0,
  //     source: 'from SPACEMAN NFT Collection by UNITAP.APP',
  //     twitterLink: 'https://twitter.com/UnitapNFT',
  //     discordLink: 'https://discord.com/invite/UnitapNFT',
  //     description: 'Anyone is welcome to play to help verify those they already know.',
  //     startTime: '20 March 2023 12:00 PM UTC',
  //     FinishTime: '30 March 2023 12:00 PM UTC',
  //   },
  //   {
  //     pk: 2,
  //     image: 'assets/images/prize-tap/prize-image-2.svg',
  //     background: 'assets/images/prize-tap/prize-background-2.svg',
  //     title: '1.00 ETH',
  //     enrolled: 1398,
  //     source: 'by BEIGI',
  //     twitterLink: 'https://twitter.com/UnitapNFT',
  //     discordLink: 'https://discord.com/invite/UnitapNFT',
  //     description:
  //       'Anyone is welcome to play to help verify those they already know. The first 2000 users who are verified in Aura can claim 2 xDai.',
  //     startTime: '20 Januray 2023 12:00 PM UTC',
  //     FinishTime: '30 March 2023 12:00 PM UTC',
  //   },
  // ]);

  return (
    <div className="grid md:flex-row wrap w-full mb-4 gap-4">
      {prizes.map((prize) => (
        <PrizeCard key={prize.pk} prize={prize} />
      ))}
    </div>
  );
};

const PrizeCard = ({ prize }: { prize: Prize }) => {
  const {
    pk,
    imageUrl,
    creator,
    creatorUrl,
    enrolled,
    twitterUrl,
    discordUrl,
    description,
    createdAt,
    deadline,
    name,
    chain,
  } = prize;
  const started = useMemo(() => new Date(createdAt) < new Date(), [createdAt]);
  return (
    <div className={pk % 2 != 0 ? 'prize-card-bg-1' : 'prize-card-bg-2'}>
      <div className="flex flex-col lg:flex-row items-center justify-center gap-4">
        <div className="prize-card__image">
          <div className="relative prize-card__container border-2 border-gray40 h-[202px] w-[202px] flex w-full bg-gray30 justify-center items-center p-5 mb-5 lg:mb-0 rounded-xl">
            <img src={imageUrl} alt={name} />
            <div className="text-gray100 text-[10px] p-2 flex gap-1 justify-center absolute bottom-[-18px] border-2 border-gray70 bg-gray30 items-center rounded-[6px]">
              <Icon
                iconSrc={chain.logoUrl}
                onClick={() => window.open(twitterUrl, '_blank')}
                width="20px"
                height="16px"
                hoverable
              />
              <p>{chain.chainName}</p>
            </div>
          </div>
        </div>
        <div className="card prize-card__content z-10 relative bg-gray30 border-2 border-gray40 ; rounded-xl p-4 pt-3 flex flex-col w-full ">
          <span className="flex justify-between w-full mb-3">
            <p className="prize-card__title text-white text-sm">{name}</p>
            {/* <p className="prize-card__enrolled-count mt-1 text-gray100 text-2xs">
              {enrolled > 0 ? enrolled + ' people enrolled' : !started ? 'not started yet' : ''}
            </p> */}
            <div className="prize-card__links flex gap-4">
              <Icon
                iconSrc="assets/images/prize-tap/twitter-logo.svg"
                onClick={() => window.open(twitterUrl, '_blank')}
                width="20px"
                height="16px"
                hoverable
              />
              <Icon
                iconSrc="assets/images/prize-tap/discord-logo.svg"
                onClick={() => window.open(discordUrl, '_blank')}
                width="20px"
                height="16px"
                hoverable
              />
            </div>
          </span>
          <span className="flex justify-between w-full mb-4">
            <p className="prize-card__source text-xs text-gray90">
              by{' '}
              <span className="hover:cursor-pointer" onClick={() => window.open(creatorUrl, '_blank')}>
                {creator}
              </span>
            </p>
          </span>
          <p className="prize-card__description text-gray100 text-xs leading-7 mb-6 grow shrink-0 basis-auto">
            {description}
          </p>
          <span className="flex flex-col md:flex-row items-center justify-between w-full gap-4 ">
            <div className="flex gap-4 justify-between w-full items-center bg-gray40 px-5 py-1 rounded-xl">
              <div>
                <p className="text-white text-[10px]">Winner in:</p>
                <p className="text-gray100 text-[10px] mt-1">1,398 / 1,400 people enrolled</p>
              </div>
              <PrizeCardTimer startTime={createdAt} FinishTime={deadline} />
            </div>
            <ClaimButton className="min-w-[552px] md:!w-[352px] !w-full">
              {' '}
              <div className="relative w-full">
                <p> Enroll</p>{' '}
                <Icon
                  className="absolute right-0 top-0"
                  iconSrc="assets/images/prize-tap/header-prize-logo.svg"
                  width="27px"
                  height="24px"
                />
              </div>
            </ClaimButton>
          </span>

          <span className="flex flex-col md:flex-row items-center justify-between w-full gap-4 mt-3 ">
            <div className="overflow-hidden relative flex gap-4 justify-between w-full items-center bg-gray40 px-5 py-1 rounded-xl min-h-[48px] winner-box-bg">
              <p className="text-[10px]">Congratulations to @MZMN for being the winner!</p>
              <Icon
                style={{ opacity: '.3' }}
                className="absolute right-0"
                iconSrc="assets/images/prize-tap/winner_bg_diamond.svg"
                width="187px"
                height="187px"
              />
            </div>
          </span>

          <span className="flex flex-col md:flex-row items-center justify-between w-full gap-4 mt-3 ">
            <div className="overflow-hidden relative flex gap-4 justify-between w-full items-center bg-gray40 px-5 py-1 rounded-xl min-h-[48px] winner-box-bg">
              <p className="text-[10px]">Congratulations @MZMN ! claim your prize now.</p>
              <Icon
                style={{ opacity: '.3' }}
                className="absolute right-0"
                iconSrc="assets/images/prize-tap/winner_bg_diamond.svg"
                width="187px"
                height="187px"
              />
            </div>
            <ClaimButton className="min-w-[552px] md:!w-[352px] !w-full">
              {' '}
              <div className="relative w-full">
                <p> Claim Prize</p>{' '}
              </div>
            </ClaimButton>
          </span>
        </div>
      </div>
    </div>
  );
};

type PrizeCardTimerProps = {
  startTime: string;
  FinishTime: string;
};

const PrizeCardTimer = ({ startTime, FinishTime }: PrizeCardTimerProps) => {
  const [now, setNow] = useState(new Date());
  const [days, setDays] = useState('00');
  const [hours, setHours] = useState('00');
  const [minutes, setMinutes] = useState('00');
  const [seconds, setSeconds] = useState('00');

  let startTimeDate = useMemo(() => new Date(startTime), [startTime]);
  let FinishTimeDate = useMemo(() => new Date(FinishTime), [FinishTime]);

  let deadline = useMemo(
    () => (startTimeDate.getTime() > now.getTime() ? startTimeDate : FinishTimeDate),
    [startTimeDate, FinishTimeDate, now],
  );

  useEffect(() => {
    // calculate time difference between now and deadline
    const diff = deadline.getTime() - now.getTime();
    if (diff <= 0) {
      return;
    }
    // time calculations for days, hours, minutes and seconds
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    // set the state with the time difference
    setSeconds(seconds < 10 ? `0${seconds}` : seconds.toString());
    setMinutes(minutes < 10 ? `0${minutes}` : minutes.toString());
    setHours(hours < 10 ? `0${hours}` : hours.toString());
    setDays(days < 10 ? `0${days}` : days.toString());
  }, [now, deadline]);

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="prize-card__timer flex items-center justify-between rounded-xl gap-4 px-3 py-2">
      <div className="prize-card__timer-item flex flex-col justify-between items-center text-[10px]">
        <p className="prize-card__timer-item-value text-white font-semibold">{days}</p>
        <p className="prize-card__timer-item-label text-gray90">d</p>
      </div>
      <p className="text-sm text-white">:</p>
      <div className="prize-card__timer-item flex flex-col justify-between items-center text-[10px]">
        <p className="prize-card__timer-item-value text-white font-semibold">{hours}</p>
        <p className="prize-card__timer-item-label text-gray90">h</p>
      </div>
      <p className="text-sm text-white">:</p>
      <div className="prize-card__timer-item flex flex-col justify-between items-center text-[10px]">
        <p className="prize-card__timer-item-value text-white font-semibold">{minutes}</p>
        <p className="prize-card__timer-item-label text-gray90">m</p>
      </div>
      <p className="text-sm text-white">:</p>
      <div className="prize-card__timer-item flex flex-col justify-between items-center text-[10px]">
        <p className="prize-card__timer-item-value text-white font-semibold">{seconds}</p>
        <p className="prize-card__timer-item-label text-gray90">s</p>
      </div>
    </div>
  );
};

export default PrizeTap;
