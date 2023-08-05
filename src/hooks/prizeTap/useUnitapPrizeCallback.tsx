import { useMemo } from 'react';
import { useWeb3React } from '@web3-react/core';
import { CallbackState, UseCallbackReturns } from '../pass/utils';
import useUnitapPrizeTransaction from './useUnitapPrizeTransaction';
import { MintTransactionInfo, TransactionType } from 'state/transactions/types';
import { BigNumberish } from 'ethers';
import { useUnitapPrizeContract } from '../useContract';

export function useUnitapPrizeCallback(
	raffleId: BigNumberish | undefined,
	nonce: BigNumberish | undefined,
	signature: string | undefined,
	multiplier: number | undefined,
	method: string | undefined | null,
	contractAddress: string | undefined,
	isPrizeNft: boolean | undefined,
): UseCallbackReturns {
	const { account, chainId, provider } = useWeb3React();
	const prizeContract = useUnitapPrizeContract(contractAddress, isPrizeNft);
	const calls = useMemo(() => {
		if (!prizeContract || !account || !raffleId || !nonce || !signature || raffleId === 0 || !method || !multiplier) {
			return [];
		}
		const data = [
			{
				address: prizeContract.address,
				calldata:
					method == 'Claim'
						? prizeContract.interface.encodeFunctionData('claimPrize', [raffleId, signature]) ?? ''
						: prizeContract.interface.encodeFunctionData('participateInRaffle', [
								raffleId,
								nonce,
								signature,
								multiplier,
						  ]) ?? '',
			},
		];
		return data;
	}, [account, raffleId, nonce, signature, multiplier, prizeContract, method]);

	const info: MintTransactionInfo = {
		type: TransactionType.MINT,
	};

	const { callback } = useUnitapPrizeTransaction(account, chainId, provider, calls, info);

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
