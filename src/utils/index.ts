import { Contract } from '@ethersproject/contracts';
import { AddressZero } from '@ethersproject/constants';
import { getAddress } from '@ethersproject/address';
import { JsonRpcSigner, Web3Provider } from '@ethersproject/providers';
import { Chain, ClaimReceipt, UserProfile } from 'types';
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
  return [
    {
      chainId: formatChainId(chain.chainId),
      chainName: chain.chainName,
      rpcUrls: [chain.rpcUrl],
      nativeCurrency: { name: chain.nativeCurrencyName, decimals: chain.decimals, symbol: chain.symbol },
      blockExplorerUrls: [chain.explorerUrl],
    },
  ];
}

export function getTxUrl(chain: Chain, claimReceipt: ClaimReceipt) {
  return `${chain.explorerUrl}tx/${claimReceipt.txHash}`;
}

export function getVerificationQr(userProfile: UserProfile) {
  return userProfile.verificationUrl.replace('https://app.brightid.org/', 'brightid://');
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

export const diffToNextMonday = (date: Date) => {
  const weekDay = date.getDay();
  const diffToMonday = 7 - (weekDay === 0 ? 7 : weekDay) + 1;
  const nextMonday = new Date(date.getFullYear(), date.getMonth(), date.getDate() + diffToMonday);
  const diffTime = Math.ceil((nextMonday.getTime() - date.getTime()) / 1000);
  return {
    seconds: String(diffTime % 60).padStart(2, '0'),
    minutes: String(Math.floor(diffTime / 60) % 60).padStart(2, '0'),
    hours: String(Math.floor(diffTime / 3600) % 24).padStart(2, '0'),
    days: String(Math.floor(diffTime / 86400)).padStart(2, '0'),
  };
};
