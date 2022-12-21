import { TransactionReceipt } from '@ethersproject/abstract-provider';
import { useWeb3React } from '@web3-react/core';
import useBlockNumber from 'lib/hooks/useBlockNumber';
import { useCallback, useEffect } from 'react';
import { retry, RetryableError, RetryOptions } from 'utils/retry';

interface Transaction {
  addedTime: number;
  receipt?: unknown;
  lastCheckedBlockNumber?: number;
}

export function shouldCheck(lastBlockNumber: number, tx: Transaction): boolean {
  if (tx.receipt) return false;
  if (!tx.lastCheckedBlockNumber) return true;
  const blocksSinceCheck = lastBlockNumber - tx.lastCheckedBlockNumber;
  if (blocksSinceCheck < 1) return false;
  const minutesPending = (new Date().getTime() - tx.addedTime) / 60000; // 60 seconds * 1000 ms
  if (minutesPending > 60) {
    // every 10 blocks if pending longer than an hour
    return blocksSinceCheck > 9;
  } else if (minutesPending > 5) {
    // every 3 blocks if pending longer than 5 minutes
    return blocksSinceCheck > 2;
  } else {
    // otherwise every block
    return true;
  }
}

const DEFAULT_RETRY_OPTIONS: RetryOptions = { n: 1, minWait: 0, maxWait: 0 };

interface UpdaterProps {
  pendingTransactions: { [hash: string]: Transaction };
  onCheck: (tx: { chainId: number; hash: string; blockNumber: number }) => void;
  onReceipt: (tx: { chainId: number; hash: string; receipt: TransactionReceipt }) => void;
}

export default function Updater({ pendingTransactions, onCheck, onReceipt }: UpdaterProps): null {
  const { chainId, provider } = useWeb3React();

  const lastBlockNumber = useBlockNumber();

  const getReceipt = useCallback(
    (hash: string) => {
      if (!provider || !chainId) throw new Error('No provider or chainId');
      const retryOptions = DEFAULT_RETRY_OPTIONS;
      return retry(
        () =>
          provider.getTransactionReceipt(hash).then((receipt) => {
            if (receipt === null) {
              console.debug(`Retrying tranasaction receipt for ${hash}`);
              throw new RetryableError();
            }
            return receipt;
          }),
        retryOptions,
      );
    },
    [chainId, provider],
  );

  useEffect(() => {
    if (!chainId || !provider || !lastBlockNumber) return;

    const cancels = Object.keys(pendingTransactions)
      .filter((hash) => shouldCheck(lastBlockNumber, pendingTransactions[hash]))
      .map((hash) => {
        const { promise, cancel } = getReceipt(hash);
        promise
          .then((receipt) => {
            if (receipt) {
              onReceipt({ chainId, hash, receipt });
            } else {
              onCheck({ chainId, hash, blockNumber: lastBlockNumber });
            }
          })
          .catch((error) => {
            if (!error.isCancelledError) {
              console.warn(`Failed to get transaction receipt for ${hash}`, error);
            }
          });
        return cancel;
      });

    return () => {
      cancels.forEach((cancel) => cancel());
    };
  }, [chainId, provider, lastBlockNumber, getReceipt, onReceipt, onCheck, pendingTransactions]);

  return null;
}
