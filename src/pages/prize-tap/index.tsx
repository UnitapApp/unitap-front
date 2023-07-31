import { useEffect, useMemo, useState } from 'react';
import { Prize } from 'types';
import Header from './components/Header/header';
import Icon from 'components/basic/Icon/Icon';
import { ClaimButton } from 'components/basic/Button/button';
import Footer from 'components/common/Footer/footer';

const PrizeTap = () => {
	return (
		<div className="prize-tap">
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
	);
};

const PrizesList = () => {
	const [prizes] = useState([
		{
			pk: 1,
			image: 'assets/images/prize-tap/prize-image-1.svg',
			title: 'SPACEMAN DELIVERY #100',
			enrolled: 0,
			source: 'from SPACEMAN NFT Collection by UNITAP.APP',
			twitterLink: 'https://twitter.com/UnitapNFT',
			discordLink: 'https://discord.com/invite/UnitapNFT',
			description: 'Anyone is welcome to play to help verify those they already know.',
			startTime: '20 March 2023 12:00 PM UTC',
			FinishTime: '30 March 2023 12:00 PM UTC',
		},
		{
			pk: 2,
			image: 'assets/images/prize-tap/prize-image-2.svg',
			title: '1.00 ETH',
			enrolled: 1398,
			source: 'by BEIGI',
			twitterLink: 'https://twitter.com/UnitapNFT',
			discordLink: 'https://discord.com/invite/UnitapNFT',
			description:
				'Anyone is welcome to play to help verify those they already know. The first 2000 users who are verified in Aura can claim 2 xDai.',
			startTime: '20 Januray 2023 12:00 PM UTC',
			FinishTime: '30 March 2023 12:00 PM UTC',
		},
	]);

	return (
		<div className="flex flex-col-reverse md:flex-row wrap w-full gap-4 mb-4">
			{prizes.map((prize) => (
				<PrizeCard key={prize.pk} prize={prize} />
			))}
		</div>
	);
};

type PrizeCardProps = {
	prize: Prize;
};

const PrizeCard = ({ prize }: PrizeCardProps) => {
	const { image, title, enrolled, source, twitterLink, discordLink, description, startTime, FinishTime } = prize;
	const started = useMemo(() => new Date(startTime) < new Date(), [startTime]);

	return (
		<div className="md:w-1/2">
			<div className="card !p-0 overflow-hidden w-full flex flex-col h-full">
				<div className="prize-card__image">
					<div className="prize-card__container h-[260px] flex w-full justify-center items-center">
						<img src={image} alt={title} />
					</div>
				</div>
				<div className="prize-card__content z-10 relative bg-gray40 rounded-t-xl p-4 pt-3 flex flex-col h-full">
					<span className="flex justify-between w-full mb-3">
						<p className="prize-card__title text-white text-sm">{title}</p>
						<p className="prize-card__enrolled-count mt-1 text-gray100 text-2xs">
							{enrolled > 0 ? enrolled + ' people enrolled' : !started ? 'not started yet' : ''}
						</p>
					</span>
					<span className="flex justify-between w-full mb-4">
						<p className="prize-card__source text-xs text-gary90">{source}</p>
						<div className="prize-card__links flex gap-4">
							<Icon
								iconSrc="assets/images/prize-tap/twitter-logo.svg"
								onClick={() => window.open(twitterLink, '_blank')}
								width="20px"
								height="16px"
								hoverable
							/>
							<Icon
								iconSrc="assets/images/prize-tap/discord-logo.svg"
								onClick={() => window.open(discordLink, '_blank')}
								width="20px"
								height="16px"
								hoverable
							/>
						</div>
					</span>
					<p className="prize-card__description text-gray100 text-xs leading-7 mb-6 grow shrink-0 basis-auto">
						{description}
					</p>
					<span className="flex flex-col sm:flex-row justify-between w-full gap-4">
						<PrizeCardTimer startTime={startTime} FinishTime={FinishTime} />
						<ClaimButton width="100% !important">
							{' '}
							<p> Enroll </p>{' '}
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
		<div className="prize-card__timer flex bg-gray30 items-center justify-between border-2 border-gray40 rounded-xl gap-2 px-3 py-2">
			<div className="prize-card__timer-item flex flex-col justify-between items-center text-[10px]">
				<p className="prize-card__timer-item-value text-gray100 font-semibold">{days}</p>
				<p className="prize-card__timer-item-label text-gray90">days</p>
			</div>
			<p className="text-sm text-gray100">:</p>
			<div className="prize-card__timer-item flex flex-col justify-between items-center text-[10px]">
				<p className="prize-card__timer-item-value text-gray100 font-semibold">{hours}</p>
				<p className="prize-card__timer-item-label text-gray90">hours</p>
			</div>
			<p className="text-sm text-gray100">:</p>
			<div className="prize-card__timer-item flex flex-col justify-between items-center text-[10px]">
				<p className="prize-card__timer-item-value text-gray100 font-semibold">{minutes}</p>
				<p className="prize-card__timer-item-label text-gray90">minutes</p>
			</div>
			<p className="text-sm text-gray100">:</p>
			<div className="prize-card__timer-item flex flex-col justify-between items-center text-[10px]">
				<p className="prize-card__timer-item-value text-gray100 font-semibold">{seconds}</p>
				<p className="prize-card__timer-item-label text-gray90">seconds</p>
			</div>
		</div>
	);
};

export default PrizeTap;
