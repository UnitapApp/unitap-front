import React, { FC, useEffect, useMemo, useState, useContext } from 'react';
import { Prize } from 'types';
import Icon from 'components/basic/Icon/Icon';
import { ClaimAndEnrollButton, ClaimButton, ClaimPrizeButton, EnrolledButton } from 'components/basic/Button/button';
import { useLocation } from 'react-router-dom';
import { useWeb3React } from '@web3-react/core';
import { PrizeTapContext } from 'hooks/prizeTap/prizeTapContext';
import { UserProfileContext } from 'hooks/useUserProfile';
import styled from 'styled-components';
import { DV } from 'components/basic/designVariables';

const Action = styled.div`
	display: flex;

	@media only screen and (max-width: ${DV.breakpoints.smallDesktop}) {
		flex-direction: column;
	}
`;

const RafflesList = () => {
	const location = useLocation();
	const { rafflesList, rafflesListLoading } = useContext(PrizeTapContext);

	const [highlightedPrize, setHighlightedPrize] = useState('');

	const prizesSortListMemo = useMemo(
		() =>
			rafflesList.sort((a, b) => {
				const lowerHighlightChainName = highlightedPrize.toLowerCase();

				if (a.name.toLowerCase() === lowerHighlightChainName) return -1;
				if (b.name.toLowerCase() === lowerHighlightChainName) return 1;

				return 0;
			}),
		[rafflesList, highlightedPrize],
	);

	useEffect(() => {
		const urlParams = new URLSearchParams(location.search);
		const highlightedPrize = urlParams.get('icebox');

		setHighlightedPrize(highlightedPrize || '');
	}, [location.search, setHighlightedPrize]);

	return (
		<div className="grid md:flex-row wrap w-full mb-4 gap-4">
			{rafflesListLoading && rafflesList.length === 0 && (
				<div style={{ color: 'white', textAlign: 'center' }} data-testid="chain-list-loading">
					Loading...
				</div>
			)}
			{!!prizesSortListMemo.length && (
				<div>
					<RaffleCard
						raffle={prizesSortListMemo[0]}
						isHighlighted={highlightedPrize.toLocaleLowerCase() === rafflesList[0].name.toLocaleLowerCase()}
					/>
				</div>
			)}

			{prizesSortListMemo.slice(1).map((rafflesList, index) => (
				<div key={index}>
					<RaffleCard key={rafflesList.pk} raffle={rafflesList} />
				</div>
			))}
		</div>
	);
};

const RaffleCard: FC<{ raffle: Prize; isHighlighted?: boolean }> = ({ raffle, isHighlighted }) => {
	const {
		pk,
		imageUrl,
		creator,
		creatorUrl,
		twitterUrl,
		discordUrl,
		description,
		createdAt,
		deadline,
		name,
		chain,
		winner,
		isExpired,
		numberOfEntries,
		maxNumberOfEntries,
		isPrizeNft,
	} = raffle;
	const { openEnrollModal, isEnrolled, isClaimed } = useContext(PrizeTapContext);
	const { userProfile } = useContext(UserProfileContext);
	const started = useMemo(() => new Date(createdAt) < new Date(), [createdAt]);
	const { account } = useWeb3React();
	const remainingPeople = maxNumberOfEntries - numberOfEntries;
	const isRemainingPercentLessThanTen = remainingPeople < (maxNumberOfEntries / 100) * 10;
	return (
		<div className={`${pk % 2 != 0 ? 'prize-card-bg-1' : 'prize-card-bg-2'} ${isHighlighted ? 'mb-20' : 'mb-4'}`}>
			<div className="flex flex-col lg:flex-row items-center justify-center gap-4">
				<div className="prize-card__image relative">
					<div className={isHighlighted ? 'before:!inset-[2px] p-[2px] gradient-outline-card' : ''}>
						<div
							className={`prize-card__container h-[212px] w-[212px] flex ${
								isHighlighted ? 'bg-g-primary-low ' : 'bg-gray30 border-2 border-gray40'
							} justify-center items-center p-5 rounded-xl`}
						>
							<img src={imageUrl} alt={name} />
						</div>
					</div>
					<div className="absolute bottom-[-10px] left-[40px] rounded-[6px] flex items-center bg-gray50  border-2 border-gray70 min-w-[130px] justify-center">
						<Icon iconSrc={chain.logoUrl} width="20px" height="16px" />
						<p className="text-gray100 text-[10px] p-1">on {chain.chainName}</p>
					</div>
				</div>
				<div className={isHighlighted ? 'before:!inset-[3px] p-[2px] gradient-outline-card w-full' : 'w-full'}>
					<div
						className={`card prize-card__content z-10 relative h-full md:max-h-[225px] md:min-h-[212px] ${
							isHighlighted ? 'bg-g-primary-low' : 'bg-gray30 border-2 border-gray40'
						} rounded-xl p-4 pt-3 flex flex-col w-full h-full`}
					>
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
								{!isPrizeNft ? (
									<span className="hover:cursor-pointer" onClick={() => window.open(creatorUrl, '_blank')}>
										by {creator}
									</span>
								) : (
									<span className="hover:cursor-pointer" onClick={() => window.open(creatorUrl, '_blank')}>
										from {creator} Collection by UNITAP.APP
									</span>
								)}
							</p>
						</span>
						<p className="prize-card__description text-gray100 text-xs leading-5 mb-6 grow shrink-0 basis-auto">
							{description}
						</p>
						<Action className={'w-full sm:w-auto items-center sm:items-end '}>
							{isExpired && !winner && !isEnrolled ? (
								<span className="flex flex-col md:flex-row items-center justify-between w-full gap-4 ">
									<div className="flex gap-4 justify-between w-full items-center bg-gray40 px-5 py-1 rounded-xl">
										<div className="flex flex-col gap-1">
											<p className="text-[10px] text-white">Winner in:</p>
											<p className="text-[10px] text-gray100">
												{!isRemainingPercentLessThanTen
													? `
											${numberOfEntries} / ${maxNumberOfEntries} people enrolled`
													: `${remainingPeople} people remains`}
											</p>
										</div>
										<RaffleCardTimer startTime={createdAt} FinishTime={deadline} />
									</div>
									<ClaimAndEnrollButton
										disabled={true}
										className="min-w-[552px] md:!w-[352px] !w-full"
										height="48px"
										fontSize="14px"
									>
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
									</ClaimAndEnrollButton>
								</span>
							) : !winner && !isEnrolled ? (
								<span className="flex flex-col md:flex-row items-center justify-between w-full gap-4 ">
									<div className="flex gap-4 justify-between w-full items-center bg-gray40 px-5 py-1 rounded-xl">
										<div className="flex flex-col gap-1">
											<p className="text-[10px] text-white">Winner in:</p>
											<p className="text-[10px] text-gray100">
												{!isRemainingPercentLessThanTen
													? `
											${numberOfEntries} / ${maxNumberOfEntries} people enrolled`
													: `${remainingPeople} people remains`}
											</p>
										</div>
										<RaffleCardTimer startTime={createdAt} FinishTime={deadline} />
									</div>
									<ClaimAndEnrollButton
										height="48px"
										fontSize="14px"
										className="min-w-[552px] md:!w-[352px] !w-full"
										onClick={() => openEnrollModal(raffle, 'Enroll')}
									>
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
									</ClaimAndEnrollButton>
								</span>
							) : !winner && isEnrolled ? (
								<span className="flex flex-col md:flex-row items-center justify-between w-full gap-4 ">
									<div className="flex gap-4 justify-between w-full items-center bg-gray40 px-5 py-1 rounded-xl">
										<div className="flex flex-col gap-1">
											<p className="text-[10px] text-white">Winner in:</p>
											<p className="text-[10px] text-gray100">
												{!isRemainingPercentLessThanTen
													? `
											${numberOfEntries} / ${maxNumberOfEntries} people enrolled`
													: `${remainingPeople} people remains`}
											</p>
										</div>
										<RaffleCardTimer startTime={createdAt} FinishTime={deadline} />
									</div>
									<EnrolledButton
										disabled={true}
										className="min-w-[552px] md:!w-[352px] !w-full"
										height="48px"
										fontSize="14px"
									>
										{' '}
										<div className="relative w-full">
											<p> Enrolled</p>{' '}
											<Icon
												className="absolute right-0 top-0"
												iconSrc="assets/images/prize-tap/header-prize-logo.svg"
												width="27px"
												height="24px"
											/>
										</div>
									</EnrolledButton>
								</span>
							) : winner && Number(winner) !== userProfile?.pk && !isClaimed ? (
								<span className="winner overflow-hidden winner-box-bg flex h-[48px] w-full items-center bg-gray40 py-1 rounded-xl align-center justify-between">
									<p className="text-[10px] text-white pl-5">Congratulations to @MZMN for being the winner!</p>
									<Icon
										className="opacity-[.3] mt-[-10px]"
										iconSrc="assets/images/prize-tap/winner_bg_diamond.svg"
										width="167px"
										height="167px"
									/>
								</span>
							) : winner && Number(winner) == userProfile?.pk && !isClaimed ? (
								<span className="flex flex-col md:flex-row items-center justify-between w-full gap-4 ">
									<div className="flex gap-4 overflow-hidden px-5 h-[48px] justify-between w-full items-center winner-box-bg  py-1 rounded-xl">
										<p className="text-[10px] text-white">Congratulations @MZMN ! claim your prize now.</p>
										<Icon
											className="opacity-[.3] mt-[-10px] mr-[-20px]"
											iconSrc="assets/images/prize-tap/winner_bg_diamond.svg"
											width="167px"
											height="167px"
										/>
									</div>

									<ClaimPrizeButton
										height="48px"
										fontSize="14px"
										className="min-w-[552px] md:!w-[352px] !w-full"
										onClick={() => openEnrollModal(raffle, 'Claim')}
									>
										{' '}
										<div className="relative w-full text-gray10">
											<p> Claim Prize</p>{' '}
										</div>
									</ClaimPrizeButton>
								</span>
							) : (
								<span className="flex flex-col md:flex-row items-center justify-between w-full gap-4 ">
									<div className="flex gap-4 overflow-hidden pl-5 h-[48px] justify-between w-full items-center winner-box-bg  py-1 rounded-xl">
										<p className="text-[10px] text-white">Congratulations to @MZMN!</p>
										<Icon
											className="opacity-[.3] mt-[-10px]"
											iconSrc="assets/images/prize-tap/winner_bg_diamond.svg"
											width="167px"
											height="167px"
										/>
									</div>
									<div className="claimed-prize w-[252px] md:!w-[352px] !w-full">
										<div className="relative text-gray10">
											<p> Claimed</p>
											<Icon
												className="absolute right-0 top-0"
												iconSrc="assets/images/prize-tap/header-prize-logo.svg"
												width="27px"
												height="24px"
											/>
										</div>
									</div>
								</span>
							)}
						</Action>
					</div>
				</div>
			</div>
		</div>
	);
};

type RaffleCardTimerProps = {
	startTime: string;
	FinishTime: string;
};

const RaffleCardTimer = ({ startTime, FinishTime }: RaffleCardTimerProps) => {
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

export default RafflesList;
