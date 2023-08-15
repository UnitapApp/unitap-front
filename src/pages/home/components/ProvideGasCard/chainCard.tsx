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
		const fetchBalance = async () => {
			try {
				if (chain.chainType === ChainType.SOLANA) {
					const connection = new Connection(
						chain.isTestnet
							? clusterApiUrl('testnet')
							: 'https://empty-magical-leaf.solana-mainnet.discover.quiknode.pro/4968f7a4791085816487ee6e15889f653f53ba13/',
					);
					const balance = await connection.getAccountInfo(new PublicKey(chain.fundManagerAddress));

					if (balance?.lamports) {
						setFundManagerBalance((balance.lamports / 1e9).toString());
					}
				} else {
					const provider = new StaticJsonRpcProvider(chain.rpcUrl);
					const balance = await provider.getBalance(chain.fundManagerAddress);
					setFundManagerBalance(balance);
				}
			} catch (error) {
				console.error(error);
			}
		};

		fetchBalance();
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
				{chain.chainName}
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
