import { FC } from 'react';

const TapLoading: FC<{ isGasTap?: boolean }> = ({ isGasTap }) => {
	return (
		<div className="relative">
			{isGasTap && <p className={'font-semibold text-sm text-white mb-2.5 mt-6'}>Weekly Ranking</p>}

			<ul className={'text-white'}>
				{Array.from(new Array(3)).map((_token, index) => (
					<li
						key={index}
						className={'flex flex-1 text-xs bg-gray30 rounded-xl py-3 px-3 items-center justify-between mb-2'}
					>
						<div className={'flex gap-2 flex-1 items-center'}>
							{isGasTap && <p>#{index + 1}</p>}
							<span className="token-logo-container w-6 h-6 flex items-center rounded-full justify-center animate-pulse bg-gray60"></span>
							<div className="animate-pulse flex-1 h-4 rounded-lg bg-gray60"></div>
						</div>
					</li>
				))}
			</ul>
		</div>
	);
};

TapLoading.defaultProps = {
	isGasTap: false,
};

export default TapLoading;
