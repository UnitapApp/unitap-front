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

export const formatBalance = (amount: number) => {
	return amount < 0.000001 ? '< 0.000001' : amount;
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
	if (chainSymbol === 'SOL') return formatSolanaBalance(amount);

	return formatWeiBalance(amount);
};

export const numberWithCommas = (x: number) => {
	return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};
