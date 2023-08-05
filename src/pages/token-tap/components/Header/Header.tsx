import { useContext } from 'react';
import Icon from 'components/basic/Icon/Icon';
import { UserProfileContext } from 'hooks/useUserProfile';
import { range } from 'utils';
import { TokenTapContext } from 'hooks/token-tap/tokenTapContext';

const Header = () => {
	const { userProfile } = useContext(UserProfileContext);

	return (
		<div className="header token-tap__header h-[202px] w-full rounded-2xl flex flex-col md:flex-row lg:items-end md:justify-between overflow-hidden relative p-4 mb-5 border-4 border-gray20">
			<div className="header-left z-10 flex flex-col justify-end items-start h-[100%]">
				<span className="flex items-center mb-2">
					<Icon className="gas-tap h-12 w-auto mb-1" iconSrc="assets/images/token-tap/token-tap-typo-logo.svg" />
					<div className="bg-gray10 px-3 py-2 border font-bold border-gray50 text-white text-xs rounded-lg">
						<p className="text-gradient-primary">Beta</p>
					</div>
				</span>
				<p className="text-xs text-gray100">
					Where everyone can claim any kind of tokens such as community tokens, NFTs, UBI token.
				</p>
			</div>
			<div className="header-right  flex mt-2 justify-center md:justify-start">
				<div className="claim-stat z-10">{userProfile ? <TokenCoins /> : <RenderConnectBrightID />}</div>
			</div>
		</div>
	);
};

const RenderConnectBrightID = () => {
	return (
		<div className="claim-stat__not-claimed rounded-lg bg-gray30 border-2 border-gray50">
			<p className="claim-stat__not-claimed__text px-4 py-3.5 text-gray80 text-xs font-bold">
				Connect BrightID to See Your Claims
			</p>
		</div>
	);
};

const TokenCoins = () => {
	const { openClaimModal, claimedTokensList } = useContext(TokenTapContext);

	return (
		<div className="claim-stat__claimed rounded-lg border-2 border-gray80 bg-primaryGradient py-[2px] px-3 flex gap-x-3">
			<>
				{claimedTokensList.map((claim, key) => {
					return (
						<Icon
							onClick={() => openClaimModal(claim.tokenDistribution)}
							key={key}
							iconSrc={claim.tokenDistribution.imageUrl || claim.tokenDistribution.chain.logoUrl}
							className={`cursor-pointer rounded-full transition ${claim.status === 'Pending' && 'animated-dabe'}`}
							width="36px"
							height="40px"
						/>
					);
				})}
				{range(0, 3 - claimedTokensList.length).map((i) => {
					return <Icon key={i} iconSrc="assets/images/token-tap/empty-coin.png" width="36px" height="36px" />;
				})}
			</>
		</div>
	);
};

export default Header;
