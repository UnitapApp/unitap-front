import { FC } from 'react';
import { Token } from 'types';
import { numberWithCommas } from 'utils/numbers';

const TokenTapLanding: FC<{ tokensList: Token[] }> = ({ tokensList }) => {
	return (
		<>
			{tokensList.length > 0 &&
				tokensList.slice(0, 3).map((token, key) => (
					<div key={key} className={'flex text-xs text-white bg-gray30 rounded-xl py-3 px-3 items-center mb-2'}>
						<span className="token-logo-container w-6 h-6">
							<img
								width={24}
								height={24}
								src={token.imageUrl}
								alt={token.name}
								className="token-logo w-auto h-[100%]"
							/>
						</span>
						<p className="text-xs ml-4">{token.name}</p>
						<p className="ml-auto">
							{numberWithCommas(token.numberOfClaims)} <span>claims</span>
						</p>
					</div>
				))}
		</>
	);
};

export default TokenTapLanding;
