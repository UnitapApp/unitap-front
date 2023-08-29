import { useMemo } from 'react';
import { useWeb3React } from '@web3-react/core';
import { CallbackState, UseCallbackReturns } from '../pass/utils';
import useUnitapPrizeTransaction from './useUnitapPrizeTransaction';
import { MintTransactionInfo, TransactionType } from 'state/transactions/types';
import { BigNumberish } from 'ethers';
import { useUnitapPrizeContract } from '../useContract';

export function useUnitapPrizeCallback(
	raffleId: BigNumberish | undefined,
	nonce: string | undefined,
	signature: string | undefined,
	owner: string | undefined,
	reqId: string | undefined,
	method: string | undefined | null,
	multiplier: number | undefined,
	contractAddress: string | undefined,
	isPrizeNft: boolean | undefined,
): UseCallbackReturns {
	const { account, chainId, provider } = useWeb3React();
	const prizeContract = useUnitapPrizeContract(contractAddress, isPrizeNft);
	const calls = useMemo(() => {
		if (
			!prizeContract ||
			!owner ||
			!reqId ||
			!account ||
			!raffleId ||
			!nonce ||
			!signature ||
			raffleId === 0 ||
			!method ||
			!multiplier
		) {
			return [];
		}
		const data = [
			{
				address: prizeContract.address,
				calldata:
					method == 'Claim'
						? prizeContract.interface.encodeFunctionData('claimPrize', [raffleId]) ?? ''
						: prizeContract.interface.encodeFunctionData('participateInRaffle', [
								raffleId,
								multiplier,
								reqId,
								{ signature: signature, owner: owner, nonce: nonce },
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
