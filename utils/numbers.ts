import { BigNumber } from "bignumber.js";

export function toBN(num: BigNumber.Value): BigNumber {
  return new BigNumber(num);
}

export const toSignificant = (
  value: bigint,
  significantDigits: number
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
      indexOfDecimal + significantDigits
    )}`;
  }
};

export const fromWei = (amount: bigint | string, decimals = 18): string => {
  const bnAmount = BigInt(amount);
  if (bnAmount === BigInt(0)) return "0";
  return (bnAmount / BigInt(10) ** BigInt(decimals)).toString();
};

export const toWei = (amount: bigint | string, decimals = 18): bigint => {
  const bnAmount = BigInt(amount);
  if (bnAmount === BigInt(0)) return BigInt(0);
  return bnAmount * BigInt(10) ** BigInt(decimals);
};

export const formatBalance = (amount: number): string => {
  return amount < 0.000001 ? "< 0.000001" : amount.toString();
};

export const formatWeiBalance = (amount: bigint | string): string => {
  const fw = fromWei(amount);
  return formatBalance(Number(fw));
};

export const formatSolanaBalance = (amount: bigint | string): string => {
  const fw = BigInt(amount) / BigInt(1e9);
  return formatBalance(Number(fw));
};

export const parseToLamports = (amount: number | string): bigint => {
  return BigInt(amount) * BigInt(1e9);
};

export const formatChainBalance = (
  amount: bigint | string,
  chainSymbol: string
): string => {
  if (chainSymbol === "SOL") return formatSolanaBalance(amount);
  return formatWeiBalance(amount);
};

export const numberWithCommas = (x: number | bigint): string => {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};
