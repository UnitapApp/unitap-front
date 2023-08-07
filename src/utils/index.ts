import { Contract } from '@ethersproject/contracts';
import { AddressZero } from '@ethersproject/constants';
import { getAddress } from '@ethersproject/address';
import { JsonRpcSigner, Web3Provider } from '@ethersproject/providers';
import { Chain } from 'types';
import { hexStripZeros } from '@ethersproject/bytes';
import { BigNumber } from '@ethersproject/bignumber';

// returns the checksummed address if the address is valid, otherwise returns false
export function isAddress(value: any): string | false {
	try {
		return getAddress(value);
	} catch {
		return false;
	}
}

// account is not optional
function getSigner(library: Web3Provider, account: string): JsonRpcSigner {
	return library.getSigner(account).connectUnchecked();
}

// account is optional
function getProviderOrSigner(library: Web3Provider, account?: string): Web3Provider | JsonRpcSigner {
	return account ? getSigner(library, account) : library;
}

// account is optional
export function getContract(address: string, ABI: any, library: Web3Provider, account?: string): Contract {
	if (!isAddress(address) || address === AddressZero) {
		throw Error(`Invalid 'address' parameter '${address}'.`);
	}

	return new Contract(address, ABI, getProviderOrSigner(library, account) as any);
}

export function shortenAddress(address: string | null | undefined) {
	if (!address) return '';
	const addressStart = address.substring(0, 6);
	const addressEnd = address.substring(address.length - 4);
	return `${addressStart}...${addressEnd}`;
}

export function formatChainId(chainId: string) {
	return hexStripZeros(BigNumber.from(chainId).toHexString());
}

export function convertChainObjectToMetaMaskParams(chain: Chain) {
	const chainId = formatChainId(chain.chainId).substring(2);
	return {
		chainId,
		chainName: chain.chainName,
		rpcUrls: [chain.rpcUrl],
		nativeCurrency: { name: chain.nativeCurrencyName, decimals: chain.decimals, symbol: chain.symbol },
		blockExplorerUrls: [chain.explorerUrl],
	};
}

export function getTxUrl(chain: Chain, txHash: string) {
	let explorerUrl = chain.explorerUrl;
	explorerUrl = explorerUrl.endsWith('/') ? explorerUrl : `${explorerUrl}/`;
	return `${explorerUrl}tx/${txHash}`;
}

export function getVerificationQr() {
	// return userProfile.verificationUrl.replace("https://app.brightid.org/", "brightid://");
	return '';
}

export async function copyToClipboard(textToCopy: string) {
	if (navigator?.clipboard && window.isSecureContext) {
		try {
			await navigator.clipboard.writeText(textToCopy);
			return;
		} catch (e) {}
	}
	let textArea = document.createElement('textarea');
	textArea.value = textToCopy;
	document.body.prepend(textArea);
	textArea.focus();
	textArea.select();
	document.execCommand('copy');
	textArea.remove();
}

export const convertTimeZoneToUTC = (date: Date) => {
	return new Date(date.getTime() + date.getTimezoneOffset() * 60000);
};

export const getNextMonday = (date: Date) => {
	const utcDate = convertTimeZoneToUTC(date);
	const weekDay = utcDate.getDay();
	const diffToMonday = 7 - (weekDay === 0 ? 7 : weekDay) + 1;
	return new Date(utcDate.getFullYear(), utcDate.getMonth(), utcDate.getDate() + diffToMonday);
};

export const getLastMonday = (date: Date) => {
	const utcDate = convertTimeZoneToUTC(date);
	const weekDay = utcDate.getDay();
	const diffToMonday = -(weekDay === 0 ? 7 : weekDay) + 1;
	return new Date(utcDate.getFullYear(), utcDate.getMonth(), utcDate.getDate() + diffToMonday);
};

export const diffToNextMonday = (date: Date) => {
	const utcDate = convertTimeZoneToUTC(date);
	const nextMonday = getNextMonday(date);
	const diffTime = Math.ceil((nextMonday.getTime() - utcDate.getTime()) / 1000);
	return {
		seconds: String(diffTime % 60).padStart(2, '0'),
		minutes: String(Math.floor(diffTime / 60) % 60).padStart(2, '0'),
		hours: String(Math.floor(diffTime / 3600) % 24).padStart(2, '0'),
		days: String(Math.floor(diffTime / 86400)).padStart(2, '0'),
	};
};

export const getChainIcon = (chain: Chain) => {
	return chain.logoUrl;
};

export const getTotalGasFeeClaims = (chains: Chain[]) => {
	return chains.reduce((total, chain) => total + chain.totalClaims, 0);
};

export const getTotalTestNetworks = (chains: Chain[]) => {
	return chains.reduce((total, chain) => total + (chain.isTestnet ? 1 : 0), 0);
};

export const getTotalNetworks = (chains: Chain[]) => {
	return chains.reduce((total, chain) => total + (!chain.isTestnet ? 1 : 0), 0);
};

export const getChainClaimIcon = (chain: Chain) => {
	return chain.gasImageUrl;
};

export function sleep(ms: number) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

export function range(start: number, end: number): number[] {
	var ans = [];
	for (let i = start; i < end; i++) {
		ans.push(i);
	}
	return ans;
}

export const EmptyCallback = () => undefined;

export const NullCallback = () => null;
