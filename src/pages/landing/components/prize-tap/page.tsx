import { FC } from 'react';
import { Prize } from 'types';
import { RaffleCardTimerLandingPage } from 'pages/prize-tap/components/RafflesList/RafflesList';

const PrizeTapLanding: FC<{ rafflesList: Prize[] }> = ({ rafflesList }) => {
	const nftImage = (tokenUri: string | undefined | null) => {
		let tokenImgLink: string | undefined = tokenUri
			? `https://ipfs.io/ipfs/QmYmSSQMHaKBByB3PcZeTWesBbp3QYJswMFZYdXs1H3rgA/${Number(tokenUri.split('/')[3]) + 1}.png`
			: undefined;
		return tokenImgLink;
	};

	return (
		<>
			{rafflesList.length > 0 &&
				rafflesList.slice(0, 2).map((raffle, key) => (
					<div
						key={key}
						className={'flex relative text-xs text-white bg-gray30 rounded-xl py-2 px-2 mb-2 overflow-hidden h-[80px] '}
					>
						<div className="z-100 w-full">
							<div className="flex gap-4">
								<div className="raffle-logo-container w-[64px] h-[63px] relative z-100 overflow-hidden">
									<span className=" w-[62px] left-[1px] h-[62px] rounded-[13px] bg-gray40 absolute overflow-hidden">
										<img
											width="62px"
											height="63px"
											src={raffle.imageUrl || nftImage(raffle.tokenUri)}
											alt={raffle.name}
										/>
									</span>
								</div>
								<div>
									<p className="">
										{raffle.isPrizeNft ? raffle.prizeAmount : raffle.prizeAmount / 10 ** raffle.decimals}{' '}
										{raffle.prizeSymbol}
									</p>
									<p className="text-secondary-text mt-2">
										{'by ' + (raffle.creatorName || raffle.creatorProfile?.username)}
									</p>
								</div>
							</div>
							<div className="flex mt-[-1.2em] ml-[6em] justify-between">
								{raffle.winnerEntry ? (
									<p className="text-gray90">Congratulations, @{raffle.winnerEntry?.userProfile?.username}</p>
								) : (
									<>
										<p className="text-gray90 ml-2">Winner in:</p>
										<RaffleCardTimerLandingPage startTime={raffle.createdAt} FinishTime={raffle.deadline} />
									</>
								)}
							</div>
						</div>
						<div className="w-full bg-gray40 absolute bottom-0 left-0 h-[30px] flex items-center justify-between px-10  "></div>
					</div>
				))}
		</>
	);
};

export default PrizeTapLanding;
