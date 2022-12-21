import { ReactNode } from 'react';
import { TransactionResponse } from '@ethersproject/providers';

export enum CallbackState {
  INVALID,
  VALID,
}

export interface UseCallbackReturns {
  state: CallbackState;
  callback?: () => Promise<TransactionResponse>;
  error?: ReactNode;
}
