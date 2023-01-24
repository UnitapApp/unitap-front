import React, { useEffect, useMemo, useState } from 'react';

import { Prize } from 'types';

import Navbar from 'components/common/Navbar/navbar';
import Header from './components/Header/header';
import Icon from 'components/basic/Icon/Icon';
import { ClaimButton } from 'components/basic/Button/button';
import Footer from 'components/common/Footer/footer';

const PrizeTap = () => {
  return (
    <div className="prize-tap">
      <Navbar />
      <div className="content-wrapper">
        <div className="m-auto flex flex-col justify-center items-center w-full">
          <div className="flex wrap w-full">
            <Header />
          </div>
          <PrizesList />
        </div>
      </div>
      <Footer />
    </div>
  )
}


const PrizesList = () => {
  const [prizes, setPrizes] = useState(
    [
      {
        pk: 1,
        image: 'assets/images/nft/mint-header.png',
        title: 'SPACEMAN DELIVERY #100',
        enrolled: 0,
        source: 'from SPACEMAN NFT Collection by UNITAP.APP',
        twitterLink: 'https://twitter.com/UnitapNFT',
        discordLink: 'https://discord.com/invite/UnitapNFT',
        discription: 'Anyone is welcome to play to help verify those they already know.',
        startTime: '20 March 2023 12:00 PM UTC',
        FinishTime: '30 March 2023 12:00 PM UTC',
      },
      {
        pk: 2,
        image: 'assets/images/nft/mint-header.png',
        title: '1.00 ETH',
        enrolled: 1398,
        source: 'by BEIGI',
        twitterLink: 'https://twitter.com/UnitapNFT',
        discordLink: 'https://discord.com/invite/UnitapNFT',
        discription: 'The first 2000 users who are verified in Aura can claim 2 xDai.',
        startTime: '20 Januray 2023 12:00 PM UTC',
        FinishTime: '30 March 2023 12:00 PM UTC',
      }
    ],
  )

  return (
    <div className="flex flex-col-reverse md:flex-row wrap w-full gap-4 mb-4">
      {
        prizes.map(prize =>
          <PrizeCard key={prize.pk} prize={prize} />
        )
      }
    </div>
  )
}

type PrizeCardProps = {
  prize: Prize
}

const PrizeCard = ({ prize }: PrizeCardProps) => {
  const { image, title, enrolled, source, twitterLink, discordLink, discription, startTime, FinishTime } = prize;
  const started = useMemo(() => new Date(startTime) < new Date(), [startTime])

  return (
    <div className='card md:w-1/2'>
      <div className='prize-card__image'>
        <div className='prize-card__container h-[260px]'>
          <img src={image} alt={title} />
        </div>
      </div>
      <div className='prize-card__content'>
        <span>
          <p className='prize-card__title'>{title}</p>
          <p className='prize-card__enrolled-count'>{enrolled > 0 ? enrolled + ' people enrolled' : !started ? 'not started yet' : ''}</p>
        </span>
        <span>
          <p className='prize-card__source'>{source}</p>
          <div className='prize-card__links'>
            <Icon iconSrc='assets/images/prize-tap/twitter-logo.svg' onClick={() => window.open(twitterLink, "_blank")} width='20px' height='16px' />
            <Icon iconSrc='assets/images/prize-tap/discord-logo.svg' onClick={() => window.open(discordLink, "_blank")} width='20px' height='16px' />
          </div>
        </span>
        <p className='prize-card__discription'>{discription}</p>
        <PrizeCardTimer startTime={startTime} FinishTime={FinishTime} />
        <ClaimButton> Enroll </ClaimButton>
      </div>
    </div>
  )
}

type PrizeCardTimerProps = {
  startTime: string,
  FinishTime: string
}

const PrizeCardTimer = ({ startTime, FinishTime }: PrizeCardTimerProps) => {
  const [now, setNow] = useState(new Date());
  const [days, setDays] = useState('00');
  const [hours, setHours] = useState('00');
  const [minutes, setMinutes] = useState('00');
  const [seconds, setSeconds] = useState('00');
  
  let startTimeDate = useMemo(() => new Date(startTime), [startTime]) 
  let FinishTimeDate = useMemo(() => new Date(FinishTime), [FinishTime])
  
  let deadline = useMemo(() => startTimeDate.getTime() > now.getTime() ? startTimeDate : FinishTimeDate, [startTimeDate, FinishTimeDate, now])

  useEffect(() => {
    // calculate time difference between now and deadline
    const diff = deadline.getTime() - now.getTime();
    // time calculations for days, hours, minutes and seconds
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    // set the state with the time difference
    setSeconds(seconds < 10 ? `0${seconds}` : seconds.toString());
    setMinutes(minutes < 10 ? `0${minutes}` : minutes.toString());
    setHours(hours < 10 ? `0${hours}` : hours.toString());
    setDays(days< 10 ? `0${days}` : days.toString());
  }, [now, deadline]);

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => {
      clearInterval(interval);
    };
  }, []);


  return (
    <div className='prize-card__timer'>
      <div className='prize-card__timer-item'>
        <p className='prize-card__timer-item-value'>{days}</p>
        <p className='prize-card__timer-item-label'>Days</p>
      </div>
      <p>:</p>
      <div className='prize-card__timer-item'>
        <p className='prize-card__timer-item-value'>{hours}</p>
        <p className='prize-card__timer-item-label'>Hours</p>
      </div>
      <p>:</p>
      <div className='prize-card__timer-item'>
        <p className='prize-card__timer-item-value'>{minutes}</p>
        <p className='prize-card__timer-item-label'>Minutes</p>
      </div>
      <p>:</p>
      <div className='prize-card__timer-item'>
        <p className='prize-card__timer-item-value'>{seconds}</p>
        <p className='prize-card__timer-item-label'>Seconds</p>
      </div>
    </div>
  )
}


export default PrizeTap;