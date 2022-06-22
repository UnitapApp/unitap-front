import { BigNumber } from '@ethersproject/bignumber';

export function calculateGasMargin(value: BigNumber): BigNumber {
  return value.mul(BigNumber.from(10000 + 2000)).div(BigNumber.from(10000));
}

export const USER_DENIED_REQUEST_ERROR_CODE = 4001;
// This might happen in different situations
export const GENERIC_ERROR_CODE = -32603;
export const GENERIC_ERROR_CODE_2 = -320000;
export const UNRECOGNIZED_CHAIN_ERROR_CODE = [4902, GENERIC_ERROR_CODE];
