import { useEffect, useMemo, useState } from 'react';

import Icon from 'components/basic/Icon/Icon';
import { Chain } from '../../../../types';
import { getChainIcon } from '../../../../utils';
import { useWeb3React } from '@web3-react/core';
import { BigNumber } from '@ethersproject/bignumber';
import { useNativeCurrencyOnChain } from '../../../../hooks/useNativeCurrency';
import JSBI from 'jsbi';
import { CurrencyAmount } from '@uniswap/sdk-core';
import { StaticJsonRpcProvider } from '@ethersproject/providers';

interface ChainItemProps {
	chain: Chain;
	selected?: boolean;
	onClick: () => void;
	'data-testid'?: string;
}

const ChainItem = (props: ChainItemProps) => {
	const { selected, chain, onClick } = props;
	const icon = getChainIcon(chain);
	const { provider } = useWeb3React();
	const [fundManagerBalance, setFundManagerBalance] = useState<BigNumber | null>(null);

	useEffect(() => {
		new StaticJsonRpcProvider(chain.rpcUrl)?.getBalance(chain.fundManagerAddress).then((balance) => {
			setFundManagerBalance(balance);
		});
	}, [chain, provider]);

	const nativeCurrency = useNativeCurrencyOnChain(Number(chain.chainId));

	const fundManagerBalanceAmount = useMemo(() => {
		if (!fundManagerBalance) return null;
		const amount = JSBI.BigInt(fundManagerBalance.toString());
		return CurrencyAmount.fromRawAmount(nativeCurrency, amount);
	}, [nativeCurrency, fundManagerBalance]);

	return (
		<div
			className="bg-gray30 rounded-xl border-2 transition-all duration-50 border-gray50 hover:bg-gray40 hover:border-gray80 flex px-4 py-3.5 pl-3 items-center mb-3 cursor-pointer last:mb-0"
			onClick={onClick}
			data-testid={props['data-testid']}
		>
			<Icon mr={2} width="32px" iconSrc={icon}></Icon>
			<p className="token-symbol text-white font-semibold mr-auto">{chain.chainName}</p>
			<p className="balance mr-2 text-gray90 text-xs">Contract Balance: </p>
			<p className="balance-amount text-white text-xs">
				{fundManagerBalanceAmount ? fundManagerBalanceAmount.toSignificant(5) : '...'}
			</p>
			{selected && <Icon className="ml-2" iconSrc="assets/images/modal/check.svg" width="13px" height="auto" />}
		</div>
	);
};

export default ChainItem;
