import Icon from 'components/basic/Icon/Icon';
import { ClaimContext } from 'hooks/useChainList';
import { useContext, useEffect, useState } from 'react';
import { ClaimReceiptState } from 'types';
import { diffToNextMonday } from 'utils';

const ClaimNotAvailable = () => {
	const { activeClaimHistory } = useContext(ClaimContext);

	const [now, setNow] = useState(new Date());
	const [days, setDays] = useState('00');
	const [hours, setHours] = useState('00');
	const [minutes, setMinutes] = useState('00');
	const [seconds, setSeconds] = useState('00');

	useEffect(() => {
		const diff = diffToNextMonday(now);
		setSeconds(diff.seconds);
		setMinutes(diff.minutes);
		setHours(diff.hours);
		setDays(diff.days);
	}, [now]);

	useEffect(() => {
		const interval = setInterval(() => setNow(new Date()), 1000);
		return () => {
			clearInterval(interval);
		};
	}, []);

	return (
		<div className="flex text-white flex-col items-center justify-center w-full pt-2">
			<div className="mt-20 claim-stat__claimed rounded-lg border-2 border-gray80 bg-primaryGradient py-[2px] px-3 flex gap-x-3">
				{activeClaimHistory
					.filter((claim) => claim.status !== ClaimReceiptState.REJECTED)
					.map((claim) => {
						return (
							<Icon
								key={claim.chain.chainId}
								iconSrc={claim.chain.gasImageUrl || claim.chain.logoUrl}
								className={`${claim.status === ClaimReceiptState.PENDING && 'animated-dabe'}`}
								width="36px"
								height="40px"
							/>
						);
					})}
			</div>
			<div className="mt-7 text-center text-gray">You have reached your claim limit for this round.</div>

			<button className="w-full mt-20 py-3 border-2 cursor-not-allowed text-gray100 font-normal bg-gray10 border-gray50 rounded-xl">
				Next Round in:
				<span className="ml-3">
					{days}d : {hours}h : {minutes}m : {seconds}s
				</span>
			</button>
		</div>
	);
};

export default ClaimNotAvailable;
