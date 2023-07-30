import { UnitapEVMTokenTap } from 'abis/types';
import { BigNumber, BigNumberish, BytesLike } from 'ethers';
import { JsonRpcProvider, TransactionResponse } from '@ethersproject/providers';
import { MintTransactionInfo, TransactionInfo, TransactionType } from 'state/transactions/types';
import isZero from 'utils/isZero';
import { calculateGasMargin } from 'utils/web3';

interface Call {
	address: string;
	calldata: string;
	value: string;
}

interface CallEstimate {
	call: Call;
}

interface SuccessfulCall extends CallEstimate {
	call: Call;
	gasEstimate: BigNumber;
}

interface FailedCall extends CallEstimate {
	call: Call;
	error: Error;
}

export const claimTokenCallback = async (
	user: string,
	token: string,
	amount: BigNumberish,
	nonce: BigNumberish,
	signature: BytesLike,
	evmTokenTapContract: UnitapEVMTokenTap,
	account: string,
	_chainId: number,
	provider: JsonRpcProvider,
	addTransaction: (response: TransactionResponse, info: TransactionInfo) => void,
	claimAddress: string,
) => {
	const info: MintTransactionInfo = {
		type: TransactionType.MINT,
	};

	const calls = [
		{
			address: claimAddress,
			calldata:
				evmTokenTapContract.interface.encodeFunctionData('claimToken', [
					user,
					token,
					BigNumber.from(amount.toString()),
					nonce,
					signature,
				]) ?? '',
			value: '0x0',
		},
	];

	const estimatedCalls: CallEstimate[] = await Promise.all(
		calls.map((call) => {
			const { address, calldata, value } = call;

			const tx =
				!value || isZero(value)
					? { from: account, to: address, data: calldata }
					: {
							from: account,
							to: address,
							data: calldata,
							value,
					  };

			return provider
				.estimateGas(tx)
				.then((gasEstimate) => {
					return {
						call,
						gasEstimate,
					};
				})
				.catch((gasError) => {
					console.debug('Gas estimate failed, trying eth_call to extract error', call);

					return provider
						.call(tx)
						.then((result) => {
							console.debug('Unexpected successful call after failed estimate gas', call, gasError, result);
							return { call, error: 'Unexpected issue with estimating the gas. Please try again' };
						})
						.catch((callError) => {
							console.debug('Call threw error', call, callError);
							return { call, error: callError.reason ?? callError.message ?? 'Error' };
						});
				});
		}),
	);

	let bestCallOption: SuccessfulCall | CallEstimate | undefined = estimatedCalls.find(
		(el, ix, list): el is SuccessfulCall =>
			'gasEstimate' in el && (ix === list.length - 1 || 'gasEstimate' in list[ix + 1]),
	);

	// check if any calls errored with a recognizable error
	if (!bestCallOption) {
		const errorCalls = estimatedCalls.filter((call): call is FailedCall => 'error' in call);
		if (errorCalls.length > 0) throw errorCalls[errorCalls.length - 1].error;
		const firstNoErrorCall = estimatedCalls.find<CallEstimate>((call): call is CallEstimate => !('error' in call));
		if (!firstNoErrorCall) throw new Error(`Unexpected error. Could not estimate gas for the transaction.`);
		bestCallOption = firstNoErrorCall;
	}

	const {
		call: { address, calldata, value },
	} = bestCallOption;

	return provider
		.getSigner()
		.sendTransaction({
			from: account,
			to: address,
			data: calldata,
			...('gasEstimate' in bestCallOption ? { gasLimit: calculateGasMargin(bestCallOption.gasEstimate) } : {}),
			...(value && !isZero(value) ? { value } : {}),
		})
		.then((response) => {
			addTransaction(response, info);
			return response;
		})
		.catch((error) => {
			// if the user rejected the tx, pass this along
			if (error?.code === 4001) {
				throw new Error(`Transaction rejected`);
			} else {
				// otherwise, the error was unexpected and we need to convey that
				console.error(`TokenTap Transaction failed`);

				throw new Error(`TokenTap Transaction failed: ${error.reason ?? error.message ?? ''}`);
			}
		});
};
