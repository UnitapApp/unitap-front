import { isAddress } from '@ethersproject/address';
import { AddressZero } from '@ethersproject/constants';
import { Contract } from '@ethersproject/contracts';
import { Web3Provider } from '@ethersproject/providers';
import MulticallJson from '@uniswap/v3-periphery/artifacts/contracts/lens/UniswapInterfaceMulticall.sol/UniswapInterfaceMulticall.json';
import { useWeb3React } from '@web3-react/core';
import { UnitapPassBatchSaleMain, UnitapPassMain, UnitapEVMTokenTap, UnitapPrizeTap } from '../abis/types';
import UnitapPassBatchSale_ABI from '../abis/UnitapPassBatchSaleMain.json';
import UnitapPass_ABI from '../abis/UnitapPassMain.json';
import UnitapEVMTokenTap_ABI from '../abis/UnitapEVMTokenTap.json';

import { Providers } from '../constants/providers';
import { useMemo } from 'react';
import { UniswapInterfaceMulticall } from '../abis/types/uniswap';
import {
	MULTICALL_ADDRESS,
	UNITAP_PASS_ADDRESS,
	UNITAP_PASS_BATCH_SALE_ADDRESS,
	UNITAP_TOKEN_TAP_ADDRESS,
} from '../constants/addresses';
import { SupportedChainId } from '../constants/chains';
import { getUnitapPassChainId } from 'utils/env';
import PrizeTap_ABI from '../abis/UnitapPrizeTap.json';
import PrizeTap_721_ABI from '../abis/UnitapPrizeTap.json';

const { abi: MulticallABI } = MulticallJson;

// returns null on errors
export function useContract<T extends Contract = Contract>(
	addressOrAddressMap: string | { [chainId: number]: string } | undefined,
	ABI: any,
	withSignerIfPossible = true,
	targetChainId?: SupportedChainId,
): T | null {
	const { provider, account, chainId } = useWeb3React();

	return useMemo(() => {
		if (!addressOrAddressMap || !ABI || !provider || !chainId) return null;
		let address: string | undefined;

		if (typeof addressOrAddressMap === 'string') address = addressOrAddressMap;
		else if (targetChainId) address = addressOrAddressMap[targetChainId];
		else address = addressOrAddressMap[chainId];
		if (!address) return null;
		try {
			return getContract(address, ABI, provider, withSignerIfPossible && account ? account : undefined, targetChainId);
		} catch (error) {
			console.error('Failed to get contract', error);
			return null;
		}
	}, [addressOrAddressMap, ABI, provider, chainId, withSignerIfPossible, account, targetChainId]) as T;
}

export function getProviderOrSigner(library: any, account?: string): any {
	return account ? getSigner(library, account) : library;
}

export function getSigner(library: any, account: string): any {
	return library.getSigner(account).connectUnchecked();
}

export function getContract<T extends Contract>(
	address: string,
	ABI: any,
	library: Web3Provider,
	account?: string,
	targetChainId?: SupportedChainId,
): T | null {
	if (!isAddress(address) || address === AddressZero) {
		throw new Error(`Invalid 'address' parameter '${address}'.`);
	}

	let providerOrSigner;
	if (targetChainId) {
		providerOrSigner = getProviderOrSigner(Providers[targetChainId], account);
	} else {
		providerOrSigner = getProviderOrSigner(library, account);
	}

	return new Contract(address, ABI, providerOrSigner) as any;
}

export function useInterfaceMulticall() {
	return useContract<UniswapInterfaceMulticall>(MULTICALL_ADDRESS, MulticallABI, false) as UniswapInterfaceMulticall;
}

export function useUnitapPassContract() {
	return useContract<UnitapPassMain>(UNITAP_PASS_ADDRESS, UnitapPass_ABI, true, getUnitapPassChainId());
}

export function useUnitapPassBatchSaleContract() {
	return useContract<UnitapPassBatchSaleMain>(
		UNITAP_PASS_BATCH_SALE_ADDRESS,
		UnitapPassBatchSale_ABI,
		true,
		getUnitapPassChainId(),
	);
}

export function useEVMTokenTapContract() {
	return useContract<UnitapEVMTokenTap>(UNITAP_TOKEN_TAP_ADDRESS, UnitapEVMTokenTap_ABI, true, SupportedChainId.GNOSIS);
}

export function useUnitapPrizeContract(contractAddress: string | undefined, isPrizeNft: boolean | undefined) {
	return useContract<UnitapPrizeTap>(contractAddress, !isPrizeNft ? PrizeTap_ABI : PrizeTap_721_ABI, true);
}
