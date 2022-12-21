import React, { useMemo } from 'react';
import { keccak256 } from '@ethersproject/keccak256';
import { toUtf8Bytes } from '@ethersproject/strings';
import { useWeb3React } from '@web3-react/core';
import { CallbackState, UseCallbackReturns } from './utils';
import { usePassContract } from 'hooks/useContract';
import usePassTransaction from './usePassTransaction';
import { MintTransactionInfo, RegisterTransactionInfo, TransactionType } from 'state/transactions/types';

export function usePassCallback(count: string): UseCallbackReturns {
  const { account, chainId, provider } = useWeb3React();

  const passContract = usePassContract();

  const calls = useMemo(() => {
    if (!passContract || !account || !count) {
      return [];
    }
    
    return [
      {
        address: passContract.address,
        calldata: passContract.interface.encodeFunctionData('multiMint', [count, account]) ?? '',
        value: '0x0',
      },
    ];
  }, [passContract, account, count]);

  const info: MintTransactionInfo = {
    type: TransactionType.MINT,
  };

  const { callback } = usePassTransaction(account, chainId, provider, calls, info);

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
