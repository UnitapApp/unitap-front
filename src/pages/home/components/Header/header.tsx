import { useContext } from 'react';
import Icon from 'components/basic/Icon/Icon';
import Timer from '../Timer/timer';
import { UserProfileContext } from 'hooks/useUserProfile';
import { ClaimContext } from 'hooks/useChainList';
import { range } from 'utils';
import { ClaimReceiptState } from '../../../../types';

const Header = () => {
	const { userProfile } = useContext(UserProfileContext);

	return (
		<div className="header gas-tap__header h-[202px] rounded-2xl flex flex-col  md:flex-row lg:items-end  md:justify-between overflow-hidden relative p-4 mb-5 border-4 border-gray20">
			<div className="header-left z-10 flex flex-col items-start">
				<Icon className="gas-tap h-12 w-[140px]" iconSrc="assets/images/gas-tap/gas-tap-text-logo.svg" />
			</div>
			<Timer />
			<div className="header-right  flex mt-2 justify-center md:justify-start">
				<div className="claim-stat z-10">{userProfile ? <Dabes /> : <RenderConnectBrightID />}</div>
			</div>
		</div>
	);
};

const Dabes = () => {
	const { activeClaimHistory, openClaimModal } = useContext(ClaimContext);
	const { gastapRoundClaimLimit } = useContext(UserProfileContext);
	return (
		<div
			data-testid="claims-chain-list"
			className="claim-stat__claimed rounded-lg border-2 border-gray80 bg-primaryGradient py-[2px] px-3 flex gap-x-3"
		>
			<>
				{activeClaimHistory
					.filter((claim) => claim.status !== ClaimReceiptState.REJECTED)
					.map((claim) => {
						return (
							<Icon
								onClick={() => openClaimModal(claim.chain.pk)}
								key={claim.chain.chainId}
								data-testid={`chain-claimed-success-dabe-${claim.pk}`}
								iconSrc={claim.chain.gasImageUrl || claim.chain.logoUrl}
								className={`cursor-pointer transition ${claim.status === ClaimReceiptState.PENDING && 'animated-dabe'}`}
								width="36px"
								height="40px"
							/>
						);
					})}
				{range(
					0,
					(gastapRoundClaimLimit ?? 5) -
						activeClaimHistory.filter((claim) => claim.status !== ClaimReceiptState.REJECTED).length,
				).map((i) => {
					return <Icon key={i} iconSrc="assets/images/gas-tap/empty-dabe.svg" width="36px" height="auto" />;
				})}
			</>
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

export default Header;
