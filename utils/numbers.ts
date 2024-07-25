import { BigNumber } from "bignumber.js";

export function toBN(num: BigNumber.Value): BigNumber {
  return new BigNumber(num);
}

export const toSignificant = (
  value: bigint,
  significantDigits: number,
): string => {
  const stringValue = value.toString(); // Convert bigint to string
  const indexOfDecimal = stringValue.length - significantDigits;

  if (indexOfDecimal <= 0) {
    // If the value is less than 1, pad zeros to the left
    const paddedValue = "0".repeat(-indexOfDecimal + 1) + stringValue;
    return `0.${paddedValue.slice(0, significantDigits)}`;
  } else {
    // Insert decimal point at the appropriate position
    return `${stringValue.slice(0, indexOfDecimal)}.${stringValue.slice(
      indexOfDecimal,
      indexOfDecimal + significantDigits,
    )}`;
  }
};

export const fromWei = (amount: BigNumber.Value, decimals = 18) => {
  const bnAmount = toBN(amount);
  if (bnAmount.isZero()) return "0";
  return bnAmount.dividedBy(toBN(10).pow(decimals)).toString();
};

export const toWei = (amount: BigNumber.Value, decimals = 18) => {
  const bnAmount = toBN(amount);
  if (bnAmount.isZero()) return 0;
  return bnAmount.multipliedBy(toBN(10).pow(decimals)).toNumber();
};

export const formatBalance = (amount: number) => {
  return amount < 0.000001 ? "< 0.000001" : amount;
};

export const formatWeiBalance = (amount: number) => {
  const fw = fromWei(amount);
  return formatBalance(Number(fw));
};

export const formatSolanaBalance = (amount: number) => {
  const fw = amount / 1e9;

  return formatBalance(fw);
};

export const parseToLamports = (amount: number | string) => {
  return Number(amount) * 1e9;
};

export const formatChainBalance = (amount: number, chainSymbol: string) => {
  if (chainSymbol === "SOL") return formatSolanaBalance(amount);

  return formatWeiBalance(amount);
};

export const numberWithCommas = (x: number | bigint): string => {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

const lerp = (a: number, b: number, amount: number) =>
  (1 - amount) * a + amount * b;

export const formatNumber = (num: number) => {
  let fixedNumber = num.toFixed(5);

  let floatNumber = parseFloat(fixedNumber);

  if (floatNumber !== num) {
    return fixedNumber;
  } else {
    return num.toString();
  }
};
