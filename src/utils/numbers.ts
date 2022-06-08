import { BigNumber } from 'bignumber.js';

export function toBN(num: BigNumber.Value): BigNumber {
  return new BigNumber(num);
}

export const BN_ZERO: BigNumber = toBN('0');
export const fromWei = (amount: BigNumber.Value, decimals = 18) => {
  const bnAmount = toBN(amount);
  if (bnAmount.isZero()) return '0';
  return bnAmount.dividedBy(toBN(10).pow(decimals)).toString();
};

export const toWei = (amount: BigNumber.Value, decimals = 18) => {
  const bnAmount = toBN(amount);
  if (bnAmount.isZero()) return 0;
  return bnAmount.multipliedBy(toBN(10).pow(decimals)).toNumber();
};
