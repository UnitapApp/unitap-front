import { BrightIdVerificationStatus, Chain, ClaimReceipt, ClaimReceiptState, PK } from '../../src/types';

import { shortenAddress } from '../../src/utils';
import { Wallet } from '@ethersproject/wallet';

// todo: figure out how env vars actually work in CI
// const TEST_PRIVATE_KEY = Cypress.env('INTEGRATION_TEST_PRIVATE_KEY')
export const TEST_PRIVATE_KEY = '0xe580410d7c37d26c6ad1a837bbae46bc27f9066a466fb3a66e770523b4666d19';
export const TEST_PRIVATE_KEY_2 = '44e229c344b78a83ebe4cbd9e8c4c368f07471465f686a33d0a6e7d9e9cf2449';

// address of the above key
export const TEST_ADDRESS_NEVER_USE = new Wallet(TEST_PRIVATE_KEY).address;
export const TEST_ADDRESS_NEVER_USE_2 = new Wallet(TEST_PRIVATE_KEY_2).address;

export const TEST_ADDRESS_NEVER_USE_SHORTENED = shortenAddress(TEST_ADDRESS_NEVER_USE);

export const SAMPLE_ERROR_MESSAGE = 'An error occurred';

export const chainList: Partial<Chain>[] = [
	{
		pk: 1 as PK,
		chainName: 'Gnosis Chain (formerly xDai) Mocked',
		chainId: '100',
		nativeCurrencyName: 'xDai',
		symbol: 'xDAI',
		decimals: 18,
		explorerUrl: 'https://blockscout.com/xdai/mainnet',
		rpcUrl: 'https://rpc.gnosischain.com',
		logoUrl: 'https://chainlist.org/_next/image?url=https%3A%2F%2Fdefillama.com%2Fchain-icons%2Frsz_xdai.jpg&w=32&q=75',
		modalUrl:
			'https://chainlist.org/_next/image?url=https%3A%2F%2Fdefillama.com%2Fchain-icons%2Frsz_xdai.jpg&w=32&q=75',
		maxClaimAmount: 10000000000000000,
		claimed: 'N/A',
		unclaimed: 'N/A',
		fundManagerAddress: TEST_ADDRESS_NEVER_USE_2,
		totalClaims: 2000,
		totalClaimsSinceLastMonday: 10,
		needsFunding: true,
		isTestnet: true,
		chainType: 'EVM',
	},
	{
		pk: 2,
		chainName: 'IDChain Mainnet Mocked',
		chainId: '74',
		nativeCurrencyName: 'Eidi',
		symbol: 'EIDI',
		decimals: 18,
		explorerUrl: 'https://explorer.idchain.one/',
		rpcUrl: 'https://idchain.one/rpc/',
		logoUrl: 'https://explorer.idchain.one/images/idchain-plain.svg',
		modalUrl: 'https://explorer.idchain.one/images/idchain-plain.svg',
		maxClaimAmount: 1000,
		claimed: 'N/A',
		unclaimed: 'N/A',
		fundManagerAddress: TEST_ADDRESS_NEVER_USE_2,
		totalClaims: 2000,
		totalClaimsSinceLastMonday: 10,
		needsFunding: false,
		isTestnet: false,
		chainType: 'EVM',
	},
];

export const chainListAuthenticatedClaimedFirst = [
	{
		pk: 1,
		chainName: 'Gnosis Chain (formerly xDai)',
		chainId: '100',
		nativeCurrencyName: 'xDai',
		symbol: 'xDAI',
		decimals: 18,
		explorerUrl: 'https://blockscout.com/xdai/mainnet',
		rpcUrl: 'https://rpc.gnosischain.com',
		logoUrl: 'https://chainlist.org/_next/image?url=https%3A%2F%2Fdefillama.com%2Fchain-icons%2Frsz_xdai.jpg&w=32&q=75',
		maxClaimAmount: 10000000000000,
		claimed: 10000000000000,
		unclaimed: 0,
	},
	{
		pk: 2,
		chainName: 'IDChain Mainnet',
		chainId: '74',
		nativeCurrencyName: 'Eidi',
		symbol: 'EIDI',
		decimals: 18,
		explorerUrl: 'https://explorer.idchain.one/',
		rpcUrl: 'https://idchain.one/rpc/',
		logoUrl: 'https://explorer.idchain.one/images/idchain-plain.svg',
		maxClaimAmount: 1000,
		claimed: 0,
		unclaimed: 1000,
	},
];

export const chainListAuthenticatedClaimed = [
	{
		pk: 1,
		chainName: 'Gnosis Chain (formerly xDai)',
		chainId: '100',
		nativeCurrencyName: 'xDai',
		symbol: 'xDAI',
		decimals: 18,
		explorerUrl: 'https://blockscout.com/xdai/mainnet',
		rpcUrl: 'https://rpc.gnosischain.com',
		logoUrl: 'https://chainlist.org/_next/image?url=https%3A%2F%2Fdefillama.com%2Fchain-icons%2Frsz_xdai.jpg&w=32&q=75',
		maxClaimAmount: 10000000000000,
		claimed: 10000000000000,
		unclaimed: 0,
	},
	{
		pk: 2,
		chainName: 'IDChain Mainnet',
		chainId: '74',
		nativeCurrencyName: 'Eidi',
		symbol: 'EIDI',
		decimals: 18,
		explorerUrl: 'https://explorer.idchain.one/',
		rpcUrl: 'https://idchain.one/rpc/',
		logoUrl: 'https://explorer.idchain.one/images/idchain-plain.svg',
		maxClaimAmount: 1000,
		claimed: 1000,
		unclaimed: 0,
	},
];

export const userProfileNotVerified = {
	address: TEST_ADDRESS_NEVER_USE,
	contextId: '76aeeab2-cd50-410e-acb7-5dfb452d961b',
	pk: 11,
	verificationStatus: BrightIdVerificationStatus.PENDING,
	verificationUrl: 'https://app.brightid.org/link-verification/GasFaucet/948347ac-d66e-410a-b389-a3d797633a23',
	wallets: [],
};

export const userProfileVerified = {
	...userProfileNotVerified,
	isAuraVerified: true,
	isMeetVerified: true,
	verificationStatus: BrightIdVerificationStatus.VERIFIED,
};

export const userMeetNotVerified = {
	...userProfileVerified,
	isMeetVerified: false,
};

export const claimMaxResponse: Omit<ClaimReceipt, 'chain'> & { chain: number } = {
	pk: 8,
	txHash: '0x26c59bf189bc48e8e9d1b0cf190187546bf3f311123d0a61e601eda30edadaab',
	chain: 1,
	datetime: '2022-04-23T16:17:23.615399Z',
	// amount: BigInt('10000000000000000'),
	amount: 100000000,
	status: ClaimReceiptState.PENDING,
};

export const emptyClaimHistoryResponse: ClaimReceipt[] = [];

export const createClaimHistory: (
	chainPk: number,
	claimStatus: ClaimReceiptState,
	pk: number,
) => Omit<ClaimReceipt, 'chain'> & { chain: number } = (chainPk, claimStatus, pk) => {
	const date = new Date();
	// const claimAmount: BigInt = BigInt('10000000000000000');
	const claimAmount = 10000000;

	return {
		pk: pk as PK,
		txHash: 'ac66sas6d66sd79900-vd',
		chain: chainPk,
		datetime: date.toString(),
		amount: claimAmount,
		status: claimStatus,
	};
};

export const getClaimHistoryRespondPending = (chainPk: number) => {
	const pk = 1023;
	return [createClaimHistory(chainPk, ClaimReceiptState.PENDING, pk)];
};
export const getClaimHistoryRespondSuccessful = (chainPk: number) => {
	const pk = 1023;
	return [createClaimHistory(chainPk, ClaimReceiptState.VERIFIED, pk)];
};
export const getClaimHistoryRespondFailed = (chainPk: number) => {
	const pk = 1023;
	return [createClaimHistory(chainPk, ClaimReceiptState.REJECTED, pk)];
};
export const getClaimHistoryRespondPendingAfterFail = (chainPk: number) => {
	const pk = 1023;
	return [
		createClaimHistory(chainPk, ClaimReceiptState.REJECTED, pk),
		createClaimHistory(chainPk, ClaimReceiptState.PENDING, pk + 1),
	];
};
export const getClaimHistoryRespondSuccessfullAfterFail = (chainPk: number) => {
	const pk = 1023;
	return [
		createClaimHistory(chainPk, ClaimReceiptState.REJECTED, pk),
		createClaimHistory(chainPk, ClaimReceiptState.VERIFIED, pk + 1),
	];
};
export const getClaimHistoryRespondFailAfterFail = (chainPk: number) => {
	const pk = 1023;
	return [
		createClaimHistory(chainPk, ClaimReceiptState.REJECTED, pk),
		createClaimHistory(chainPk, ClaimReceiptState.REJECTED, pk + 1),
	];
};
