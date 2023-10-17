import { ClaimAndEnrollButton, Button } from 'components/basic/Button/button';
import Icon from 'components/basic/Icon/Icon';
import Tooltip from 'components/basic/Tooltip';
import { PrizeTapContext } from 'hooks/prizeTap/prizeTapContext';
import { FC, useContext, useState, useEffect, useMemo } from 'react';
import { Prize } from 'types';
import { RaffleCardTimer } from '../RafflesList/RafflesList';
import { DV } from 'components/basic/designVariables';
import styled from 'styled-components';
import { LineaRaffleEntry } from '../types';
import { getLineaRaffleEntries } from 'api';
import { RefreshContext } from 'context/RefreshContext';
import { ReactComponent as CheckCircleImage } from './check-circle.svg';
import { numberWithCommas } from 'utils/numbers';

const Action = styled.div`
	display: flex;

	@media only screen and (max-width: ${DV.breakpoints.smallDesktop}) {
		flex-direction: column;
	}
`;

export const getUserEntry = (entryWallets: LineaRaffleEntry[], userWallet?: string) => {
	return (
		!!userWallet &&
		entryWallets.find((entry) => entry.walletAddress.toLocaleLowerCase() === userWallet.toLocaleLowerCase())
	);
};

export const LineaRaffleCard: FC<{ raffle: Prize; isHighlighted?: boolean }> = ({ raffle, isHighlighted }) => {
	const {
		imageUrl,
		tokenUri,
		creatorUrl,
		twitterUrl,
		discordUrl,
		creatorName,
		description,
		startAt,
		deadline,
		name,
		chain,
		isExpired,
		numberOfOnchainEntries,
		maxNumberOfEntries,
		isPrizeNft,
		userEntry,
		winnerEntry,
		prizeSymbol,
		decimals,
		prizeAmount,
		creatorProfile,
		maxMultiplier,
	} = raffle;

	const creator = creatorName || creatorProfile?.username;

	const { slowRefresh } = useContext(RefreshContext);

	const {
		openEnrollModal,
		setIsLineaCheckEnrolledModalOpen,
		setIsLineaWinnersOpen,
		lineaEnrolledUsers,
		setLineaEnrolledUsers,
	} = useContext(PrizeTapContext);
	const [start, setStarted] = useState<boolean>(true);
	const [showAllPermissions, setShowAllPermissions] = useState(false);

	const isEnded = (new Date().getTime() - new Date(deadline).getTime()) / (1000 * 60) > 0;

	const firstWinner = useMemo(() => lineaEnrolledUsers.find((entry) => entry.isWinner), [lineaEnrolledUsers]);

	useEffect(() => {
		setStarted(new Date(startAt) < new Date());
	}, [new Date()]);

	useEffect(() => {
		getLineaRaffleEntries().then((res) => {
			setLineaEnrolledUsers(res);
		});
	}, [slowRefresh]);

	const tokenImgLink: string | undefined = tokenUri
		? `https://ipfs.io/ipfs/QmYmSSQMHaKBByB3PcZeTWesBbp3QYJswMFZYdXs1H3rgA/${Number(tokenUri.split('/')[3]) + 1}.png`
		: undefined;

	const prizeLink = isPrizeNft
		? imageUrl
			? imageUrl
			: tokenImgLink
		: `https://etherscan.io/address/${raffle.prizeAsset}`;

	const onPrizeClick = () => {
		if (prizeLink) window.open(prizeLink, '_blank');
	};

	return (
		<>
			<div className={`prize-card-linea ${isHighlighted ? 'mb-20' : 'mb-4'}`}>
				<div className="flex flex-col lg:flex-row items-center justify-center gap-4 p-5 lg:p-0 rounded-xl bg-gray30 lg:bg-inherit">
					<div className="prize-card__image relative mb-3 lg:mb-0">
						<div className={isHighlighted ? 'before:!inset-[2px] p-[2px] gradient-outline-card' : ''}>
							<div
								className={`prize-card__container h-[212px] w-[212px] flex flex-col ${
									isHighlighted ? 'bg-g-primary-low ' : 'bg-gray30 border-2 border-gray40'
								} justify-center items-center p-5 rounded-xl`}
							>
								<img
									onClick={onPrizeClick}
									src={'assets/images/prize-tap/linea-raffle-image.svg'}
									alt={name}
									width={!isPrizeNft ? '168px' : ''}
									className={`${!isPrizeNft ? 'ml-1' : ''} cursor-pointer mb-2`}
								/>
							</div>
						</div>
						<div className="absolute bottom-[-10px] left-[40px] rounded-[6px] flex items-center bg-gray50 border-2 border-gray70 min-w-[130px] justify-center">
							<p className="text-gray100 text-[10px] p-1">on</p>
							<img src="/assets/images/prize-tap/linea.svg" className="ml-2" alt="" />
						</div>
					</div>
					<div
						className={
							isHighlighted ? 'before:!inset-[3px] p-[2px] relative gradient-outline-card w-full' : 'w-full relative'
						}
					>
						<img
							src="/assets/images/prize-tap/linia-prize-bg.svg"
							alt="prize-tap"
							className="top-0 right-0 z-20 absolute"
						/>

						<div
							className={`card prize-card__content relative h-full md:max-h-[225px] md:min-h-[212px] ${
								isHighlighted ? 'bg-g-primary-low' : 'bg-gray30 border-2 border-gray40'
							} rounded-xl p-4 pt-3 flex flex-col w-full h-full`}
						>
							<img
								src="/assets/images/prize-tap/linea-texture.svg"
								alt="prize-tap"
								className="top-0 left-0 z-10 absolute"
							/>
							<span className="flex relative z-20 justify-between w-full mb-1">
								<div className="flex items-center gap-x-2">
									<p className="prize-card__title cursor-pointer text-[#61DFFF] text-sm" onClick={onPrizeClick}>
										{name}
									</p>
									<small className="rounded-lg font-bold text-xs p-1 bg-[#0E1217] text-[#1D788F]">
										x{maxMultiplier} Winners
									</small>
								</div>
								<div className="prize-card__links text-secondary-text flex gap-4">
									{twitterUrl && (
										<Icon
											iconSrc="assets/images/prize-tap/linea-twitter-logo.svg"
											onClick={() => window.open(twitterUrl, '_blank')}
											width="20px"
											height="16px"
											hoverable
										/>
									)}
									{discordUrl && (
										<Icon
											iconSrc="assets/images/prize-tap/discord-logo-linea.svg"
											onClick={() => window.open(discordUrl, '_blank')}
											width="20px"
											height="16px"
											hoverable
										/>
									)}
									<Icon
										iconSrc="assets/images/prize-tap/website.svg"
										onClick={() => window.open('https://linea.build', '_blank')}
										width="20px"
										height="16px"
										hoverable
									/>
								</div>
							</span>
							<span className="flex relative z-20 justify-between w-full mb-4">
								<p className="prize-card__source text-xs text-[#61DFFF]">
									{!isPrizeNft ? (
										<span className="hover:cursor-pointer" onClick={() => window.open(creatorUrl, '_blank')}>
											by {creator}
										</span>
									) : (
										<span className="hover:cursor-pointer" onClick={() => window.open(creatorUrl, '_blank')}>
											by {creator}
										</span>
									)}
								</p>
							</span>
							<p className="prize-card__description text-[#1D677C] text-xs leading-5 mb-2 grow shrink-0 basis-auto text-justify">
								{description}
							</p>

							<p className="text-[#1D677C] flex items-center gap-2 bg-gray30 text-xs leading-5 mb-2 grow shrink-0 basis-auto">
								{numberWithCommas(maxNumberOfEntries)} Whitelisted Wallets automatically enrolled to this raffle by
								Linea <CheckCircleImage />
							</p>

							{!winnerEntry && !userEntry?.txHash && !raffle.isExpired && (
								<span className="text-xs mb-3">
									<div className={`flex items-center flex-wrap text-xs gap-2 text-white`}>
										{(showAllPermissions
											? raffle.constraints
											: raffle.constraints.filter((permission) => permission.type === 'VER').slice(0, 6)
										).map((permission, key) => (
											<Tooltip
												onClick={openEnrollModal.bind(null, raffle, 'Verify')}
												className={
													'border-gray70 bg-gray50 hover:bg-gray10 transition-colors border px-3 py-2 rounded-lg '
												}
												data-testid={`token-verification-${raffle.id}-${permission.name}`}
												key={key}
												text={permission.description}
											>
												<div className="flex items-center gap-3">{permission.title}</div>
											</Tooltip>
										))}

										{raffle.constraints.length > 6 && (
											<button
												onClick={setShowAllPermissions.bind(null, !showAllPermissions)}
												className="border-gray70 flex items-center z-10 bg-gray60 transition-colors border px-3 py-2 rounded-lg"
											>
												<span>{showAllPermissions ? 'Show less' : 'Show more'}</span>
												<img
													alt="angle down"
													src="/assets/images/token-tap/angle-down.svg"
													className={`ml-2 ${showAllPermissions ? 'rotate-180' : ''} transition-transform`}
												/>
											</button>
										)}
									</div>
								</span>
							)}

							<Action className={'w-full sm:w-auto items-center sm:items-end'}>
								{(isExpired && !firstWinner) || (!firstWinner && maxNumberOfEntries === numberOfOnchainEntries) ? (
									<span className="flex flex-col md:flex-row items-center justify-between w-full gap-4 ">
										<div className="flex flex-col sm:flex-row gap-4 justify-between w-full md:items-center bg-gray40 px-5 py-1 rounded-xl">
											<div className="flex flex-col gap-1">
												<p className="text-[10px] text-white">{start ? 'Winners in:' : 'Starts in:'}</p>
											</div>
											<RaffleCardTimer startTime={startAt} FinishTime={deadline} />
										</div>
										<ClaimAndEnrollButton
											disabled={true}
											className="min-w-[552px] md:!w-[352px] !w-full"
											height="48px"
											fontSize="14px"
										>
											{' '}
											<div className="relative w-full">
												{maxNumberOfEntries === numberOfOnchainEntries ? <p> Full</p> : <p> Unavailable</p>}
												<Icon
													className="absolute right-0 top-[-2px]"
													iconSrc="assets/images/prize-tap/header-prize-logo.svg"
													width="27px"
													height="24px"
												/>
											</div>
										</ClaimAndEnrollButton>
									</span>
								) : !isEnded ? (
									<span className="flex flex-col md:flex-row items-center justify-between w-full gap-4">
										<div className="flex flex-col sm:flex-row gap-4 justify-between w-full md:items-center bg-gray40 px-5 py-1 rounded-xl">
											<div className="flex flex-col gap-1">
												<p className="text-[10px] text-white">{start ? 'Winners in:' : 'Starts in:'}</p>
											</div>
											<RaffleCardTimer startTime={startAt} FinishTime={deadline} />
										</div>

										<Button
											onClick={() => setIsLineaCheckEnrolledModalOpen(true)}
											className="min-w-[552px] px-5 border-2 flex justify-center border-[#61DFFF] rounded-xl transition-colors active:bg-[#1C222B] text-[#61DFFF] text-center bg-[#191921] py-3 md:!w-[352px] !w-full"
											height="48px"
											fontSize="14px"
										>
											<p> Check Enrolled Wallets </p>
										</Button>
									</span>
								) : (
									<span className="flex flex-col md:flex-row items-center justify-between w-full gap-4 ">
										<div className="flex gap-4 overflow-hidden px-5 h-[48px] justify-between w-full items-center winner-box-bg  py-1 rounded-xl">
											<p className="text-[10px] text-white">Raffle is done, check the winners: </p>
											{/* <Icon
												className="opacity-[.3] mt-[-10px] mr-[-20px]"
												iconSrc="/assets/images/prize-tap/linia-winner-bg.svg"
												width="215px"
												height="215px"
											/> */}
										</div>
										<Button
											disabled={!start}
											className="min-w-[552px] px-5 border-2 flex justify-center border-[#61DFFF] rounded-xl text-[#61DFFF] text-center bg-[#191921] py-3 md:!w-[352px] !w-full"
											onClick={() => setIsLineaWinnersOpen(true)}
										>
											<div className="relative w-full">
												<p> Check Winner Wallets </p>{' '}
											</div>
										</Button>
									</span>
								)}
							</Action>
						</div>
					</div>
				</div>
			</div>
		</>
	);
};
