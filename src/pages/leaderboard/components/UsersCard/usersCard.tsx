import { UsersCardProps } from 'types';
import Icon from 'components/basic/Icon/Icon';
import { shortenAddress } from 'utils';

const UsersCard = ({ user, currentUser, index }: UsersCardProps & { index: number }) => {
	const {
		id,
		image,
		username,
		level,
		wallet: walletAddress,
		sumTotalPrice: totalGas,
		twitterLink,
		instagramLink,
	} = user;
	return (
		<div className="pt-4">
			<div
				className={
					currentUser.username == user.username
						? 'bg-gray30 justify-between rounded-2xl flex flex-col md:flex-row xl:flex-row user-card__wrap'
						: 'bg-gray30 justify-between rounded-2xl flex flex-col md:flex-row xl:flex-row'
				}
			>
				<div className="flex flex-col  md:flex-row xl:flex-row rounded-2xl overflow-hidden ">
					<div
						className={
							index <= 3
								? `user__id user-card__id__${index} text-black md:w-[40px] h-[40px] md:h-[auto]`
								: `user__id text-white md:w-[40px] h-[40px] md:h-[auto] user-card__id`
						}
					>
						<div>#{id}</div>
					</div>
					<Icon
						iconSrc={'assets/images/leaderboard/profileImage.svg'}
						width="46px"
						height="52px"
						className="p-2 px-4"
					/>
					<div className="flex flex-col gap-3 p-2 text-[12px] md:mr-3 lg:mr-10 items-center md:items-start">
						<div className="text-white font-bold min-w-[100px] text-center md:text-left user-card__name">
							{username}
						</div>
						<div className="text-gray100 user-card_level_color">Level {level}</div>
					</div>
					<div className="flex flex-col gap-3 p-2 text-[12px]  md:mr-3 lg:mr-10 items-center md:items-start">
						<div className="text-gray80 user-card_title_color">Wallet Address</div>
						<div className="text-white flex gap-2 xl:justify-between">
							<div>{shortenAddress(walletAddress)}</div>
							<div>
								<Icon iconSrc="assets/images/leaderboard/ic_copy.svg" width="12px" height="14px" hoverable />
							</div>
						</div>
					</div>
					<div className="flex flex-col gap-2 p-2  md:mr-3 lg:mr-10 items-center md:items-start">
						<div className="text-gray80 text-[12px] user-card_title_color">Total Gas Provided</div>
						<div className="text-white text-[14px] user-card_title_color">${totalGas}</div>
					</div>
					<div className="flex flex-col gap-2 p-2 items-center mr-0">
						<div className="text-gray80 text-[12px] user-card_title_color">Interacted Chains</div>
						<div className="flex xl:justify-between items-center gap-3">
							<Icon iconSrc="assets/images/leaderboard/ic_arbitrum.svg" width="24px" height="24px" hoverable />
							<Icon iconSrc="assets/images/leaderboard/chain1.svg" width="24px" height="24px" hoverable />
							<Icon iconSrc="assets/images/leaderboard/telos.svg" width="24px" height="24px" hoverable />
						</div>
					</div>
				</div>
				<div className="flex xl:justify-between items-center gap-6 m-4 z-index-master justify-center ">
					{instagramLink && (
						<Icon
							iconSrc="assets/images/social/instagram.svg"
							width="16px"
							height="20px"
							onClick={() => window.open(instagramLink, '_blank')}
							hoverable
						/>
					)}
					{twitterLink && (
						<Icon
							iconSrc="assets/images/social/twitter.svg"
							width="16px"
							height="20px"
							onClick={() => window.open(twitterLink, '_blank')}
							hoverable
						/>
					)}
				</div>
			</div>
		</div>
	);
};

export default UsersCard;
