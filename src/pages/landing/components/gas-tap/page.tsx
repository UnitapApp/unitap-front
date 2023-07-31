import NotAvailableTap from '../notAvailableTap';
import { UserProfileContext } from 'hooks/useUserProfile';
import { useContext, useMemo } from 'react';
import { Chain } from 'types';
import { sortChainListByTotalClaimWeekly } from 'utils/hook/sortChainList';

const GasTapLanding = ({ chainList }: { chainList: Chain[] }) => {
	const { isGasTapAvailable } = useContext(UserProfileContext);

	const sortedChainList = useMemo(() => sortChainListByTotalClaimWeekly(chainList), [chainList]);

	return (
		<div className="relative">
			<div className={isGasTapAvailable ? '' : 'blur-md'}>
				{sortedChainList.length > 0 && (
					<>
						<p className={'font-semibold text-sm text-white mb-2.5 mt-6'}>Weekly Ranking</p>
						<ul className={'text-white'}>
							{sortedChainList.slice(0, 3).map((token, index) => (
								<li
									key={token.chainId}
									className={'flex text-xs bg-gray30 rounded-xl py-3 px-3 items-center justify-between mb-2'}
								>
									<div className={'flex gap-2 items-center'}>
										<p>#{index + 1}</p>
										<span className="token-logo-container w-6 h-6 flex items-center justify-center">
											<img
												src={token.logoUrl}
												width={24}
												height={24}
												alt={token.chainName}
												className="token-logo w-auto h-[100%]"
											/>
										</span>
										<p>{token.chainName}</p>
									</div>
									<p>
										{token.totalClaimsSinceLastMonday} <span>claims</span>
									</p>
								</li>
							))}
						</ul>
					</>
				)}
			</div>
			{isGasTapAvailable || <NotAvailableTap />}
		</div>
	);
};

export default GasTapLanding;
