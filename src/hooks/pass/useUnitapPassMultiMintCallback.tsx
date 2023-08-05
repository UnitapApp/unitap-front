import { useMemo } from 'react';
import { useWeb3React } from '@web3-react/core';
import { CallbackState, UseCallbackReturns } from './utils';
import useUnitapPassBatchSaleTransaction from './useUnitapPassBatchSaleTransaction';
import { MintTransactionInfo, TransactionType } from 'state/transactions/types';
import { BigNumberish } from 'ethers';
import { useUnitapBatchSale } from './useUnitapBatchSale';
import { useUnitapPassBatchSaleContract } from '../useContract';

export function useUnitapPassMultiMintCallback(count: BigNumberish): UseCallbackReturns {
	const { account, chainId, provider } = useWeb3React();
	const { price } = useUnitapBatchSale();
	const passContract = useUnitapPassBatchSaleContract();

	const calls = useMemo(() => {
		if (!passContract || !account || !count || !price) {
			return [];
		}
		const data = [
			{
				address: passContract.address,
				calldata: passContract.interface.encodeFunctionData('multiMint', [count, account]) ?? '',
				value: price.mul(count).toHexString(),
			},
		];
		return data;
	}, [account, count, passContract, price]);

	const info: MintTransactionInfo = {
		type: TransactionType.MINT,
	};

	const { callback } = useUnitapPassBatchSaleTransaction(account, chainId, provider, calls, info);

	return useMemo(() => {
		if (!provider || !account || !chainId || !callback) {
			return { state: CallbackState.INVALID, error: <div>Missing dependencies</div> };
		}

		return {
			state: CallbackState.VALID,
			callback: async () => callback(),
		};
	}, [provider, account, chainId, callback]);
}
