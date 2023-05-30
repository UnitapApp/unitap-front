import React, { useMemo } from 'react';
import { useWeb3React } from '@web3-react/core';
import { CallbackState, UseCallbackReturns } from '../pass/utils';
import useTokenTapTransaction from './useTokenTapTransaction';
import { MintTransactionInfo, TransactionType } from 'state/transactions/types';
import { BigNumberish, BytesLike } from 'ethers';
import { useEVMTokenTapContract } from '../useContract';

export function useTokenTapClaimTokenCallback(
  user: string,
  token: string,
  amount: BigNumberish,
  nonce: BigNumberish,
  signature: BytesLike,
): UseCallbackReturns {
  const { account, chainId, provider } = useWeb3React();
  const evmTokenTapContract = useEVMTokenTapContract();

  const calls = useMemo(() => {
    if (!evmTokenTapContract || !account || !user || !token || !amount || !nonce || !signature) {
      return [];
    }
    const data = [
      {
        address: evmTokenTapContract.address,
        calldata:
          evmTokenTapContract.interface.encodeFunctionData('claimToken', [user, token, amount, nonce, signature]) ?? '',
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
