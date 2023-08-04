import { useEffect, useMemo, useState } from 'react';

import Icon from 'components/basic/Icon/Icon';

import { Chain, ChainType } from 'types';
import { useWeb3React } from '@web3-react/core';
import { BigNumber } from '@ethersproject/bignumber';
import { useNativeCurrencyOnChain } from '../../../../hooks/useNativeCurrency';
import JSBI from 'jsbi';
import { CurrencyAmount } from '@uniswap/sdk-core';
import { StaticJsonRpcProvider } from '@ethersproject/providers';
import { Connection, PublicKey, clusterApiUrl } from '@solana/web3.js';

interface props {
	chain: Chain;
}

const ChainCard = ({ chain }: props) => {
	const { provider } = useWeb3React();
	const [fundManagerBalance, setFundManagerBalance] = useState<BigNumber | string | null>(null);

	useEffect(() => {
		if (chain.chainType === ChainType.SOLANA) {
			const connection = new Connection(
				chain.isTestnet ? clusterApiUrl('testnet') : 'https://api.metaplex.solana.com/',
			);

			connection
				.getBalance(new PublicKey(chain.fundManagerAddress))
				.then((balance) => {
					setFundManagerBalance((balance / 1e9).toString());
				})
				.catch((e) => console.log(e));
		} else {
			new StaticJsonRpcProvider(chain.rpcUrl)?.getBalance(chain.fundManagerAddress).then((balance) => {
				setFundManagerBalance(balance);
			});
		}
	}, [chain, provider]);

	const nativeCurrency = useNativeCurrencyOnChain(Number(chain.chainId));

	function numberWithCommas(x: number) {
		return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
	}

	const fundManagerBalanceAmount = useMemo(() => {
		if (!fundManagerBalance || typeof fundManagerBalance === 'string') return null;
		const amount = JSBI.BigInt(fundManagerBalance.toString());
		return CurrencyAmount.fromRawAmount(nativeCurrency, amount);
	}, [nativeCurrency, fundManagerBalance]);

	return (
		<div className="chain p-5 lg:w-36 xl:w-40 sm:border-r-2 border-r-gray30">
			<div className="chain__name flex mb-4 text-white">
				{chain.symbol}
				<Icon className="ml-2" iconSrc={chain.logoUrl} width="auto" height="22px" />
			</div>
			<p className="chain__info text-xs text-gray90 flex">
				balance:
				<span className="chain__info__balance text-white ml-1">
					{fundManagerBalanceAmount
						? typeof fundManagerBalance === 'string'
							? fundManagerBalance
							: numberWithCommas(parseFloat(fundManagerBalanceAmount.toSignificant(5)))
						: '...'}
				</span>
			</p>
		</div>
	);
};

export default ChainCard;
