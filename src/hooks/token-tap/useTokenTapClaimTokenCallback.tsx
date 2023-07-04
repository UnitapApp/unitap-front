import React, { useMemo } from 'react';
import { useWeb3React } from '@web3-react/core';
import { CallbackState, UseCallbackReturns } from '../pass/utils';
import useTokenTapTransaction from './useTokenTapTransaction';
import { MintTransactionInfo, TransactionType } from 'state/transactions/types';
import { BigNumberish, BytesLike, ethers } from 'ethers';
import { useEVMTokenTapContract } from '../useContract';
import { BigNumber } from '@ethersproject/bignumber';

export function useTokenTapClaimTokenCallback(
	user: string | undefined,
	token: string | undefined,
	amount: BigNumberish | undefined,
	nonce: BigNumberish | undefined,
	signature: BytesLike | undefined,
): UseCallbackReturns {
	const { account, chainId, provider } = useWeb3React();
	const evmTokenTapContract = useEVMTokenTapContract();
	const calls = useMemo(() => {
		if (
			!evmTokenTapContract ||
			!account ||
			!user ||
			!token ||
			!amount ||
			!nonce ||
			!signature ||
			!signature.toString().startsWith('0x')
		) {
			return [];
		}

		const data = [
			{
				address: evmTokenTapContract.address,
				calldata:
					evmTokenTapContract.interface.encodeFunctionData('claimToken', [
						user,
						token,
						BigNumber.from(amount),
						nonce,
						signature,
					]) ?? '',
				value: '0x0',
			},
		];
		return data;
	}, [account, amount, evmTokenTapContract, nonce, signature, token, user]);

	const info: MintTransactionInfo = {
		type: TransactionType.MINT,
	};
	const { callback } = useTokenTapTransaction(account, chainId, provider, calls, info);

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
