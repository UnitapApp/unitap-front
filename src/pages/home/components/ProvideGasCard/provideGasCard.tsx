import React, { useContext, useEffect } from 'react';
import { LightOutlinedButton } from 'components/basic/Button/button';
import { ClaimContext } from 'hooks/useChainList';
import ChainCard from './chainCard';
import { FundContext } from 'pages/home/context/fundContext';

const ProvideGasCard = () => {
	const [chainListIndex, setChainListIndex] = React.useState(0);
	const { chainList } = useContext(ClaimContext);

	const { setIsOpen } = useContext(FundContext);

	useEffect(() => {
		setTimeout(() => {
			if (chainListIndex > chainList.length - 5) {
				setChainListIndex(0);
			} else {
				setChainListIndex(chainListIndex + 4);
			}
		}, 10000);
	}, [chainListIndex, chainList]);

	if (chainList.length > 0) {
		return (
			<div className="provide-gas pb-4 sm:pb-0 w-full flex flex-col sm:flex-row items-center bg-gray40 border-2 border-gray30 rounded-xl">
				<section className={'flex flex-col md:flex-row'}>
					<ChainCard chain={chainList[chainListIndex]} />
					<ChainCard chain={chainList[(chainListIndex + 1) % chainList.length]} />
				</section>
				<section className={'flex flex-col md:flex-row'}>
					<ChainCard chain={chainList[(chainListIndex + 2) % chainList.length]} />
					<ChainCard chain={chainList[(chainListIndex + 3) % chainList.length]} />
				</section>
				<span className="m-auto" onClick={setIsOpen.bind(null, true)}>
					<LightOutlinedButton className={'!bg-gray00 !w-48 lg:!w-60'} fontSize="14" height="46px">
						Provide Gas Fee
					</LightOutlinedButton>
				</span>
			</div>
		);
	}

	return <></>;
};

export default ProvideGasCard;
