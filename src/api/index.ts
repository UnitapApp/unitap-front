import { Chain, ClaimReceipt, Settings, UserProfile } from 'types';
import axios from 'axios';
import { getLastMonday } from 'utils';

const axiosInstance = axios.create({
	baseURL: process.env.NODE_ENV === 'development' ? '' : process.env.REACT_APP_API_URL,
});

export async function getChainList() {
	const response = await axiosInstance.get<Chain[]>('/api/v1/chain/list/');
	return response.data;
}

export async function getUserProfile(address: string, signature: string) {
	const response = await axiosInstance.post<UserProfile>(`/api/auth/user/login/`, {
		username: address,
		password: signature,
	});
	return response.data;
}

export async function createUserProfile(address: string) {
	const response = await axiosInstance.post<UserProfile>(`/api/v1/user/create/`, { address });
	return response.data;
}

export async function claimMax(token: string, chainPk: number) {
	const response = await axiosInstance.post<ClaimReceipt>(`/api/v1/chain/${chainPk}/claim-max/`, null, {
		headers: {
			Authorization: `Token ${token}`,
		},
	});
	return response.data;
}

export async function claimMaxNonEVMAPI(token: string, chainPk: number, address: string) {
	const response = await axiosInstance.post<ClaimReceipt>(
		`/api/v1/chain/${chainPk}/claim-max/`,
		{ address: address },
		{
			headers: {
				Authorization: `Token ${token}`,
			},
		},
	);
	return response.data;
}

export async function getActiveClaimHistory(token: string) {
	const date = new Date();
	const lastMonday = getLastMonday(date).toISOString();
	const response = await axiosInstance.get<ClaimReceipt[]>('/api/v1/user/claims/', {
		headers: {
			Authorization: `Token ${token}`,
		},
	});

	return response.data.filter((claim) => claim.datetime >= lastMonday).sort((b, a) => a.pk - b.pk);
}

export async function getUserProfileWithTokenAPI(token: string) {
	const response = await axiosInstance.get<UserProfile>(`/api/auth/user/info/`, {
		headers: {
			Authorization: `Token ${token}`,
		},
	});
	return response.data;
}

export async function getWeeklyChainClaimLimitAPI(token: string) {
	const response = await axiosInstance.get<Settings>('/api/v1/settings/', {
		headers: {
			Authorization: `Token ${token}`,
		},
	});
	return response.data;
}

export async function getRemainingClaimsAPI(token: string) {
	const response = await axiosInstance.get('/api/v1/user/remainig-claims/', {
		headers: {
			Authorization: `Token ${token}`,
		},
	});
	return response.data;
}

export async function setWalletAPI(token: string, wallet: string, walletType: string) {
	const response = await axiosInstance.post(
		'/api/auth/user/set-wallet/',
		{ walletType: walletType, address: wallet },
		{
			headers: {
				Authorization: `Token ${token}`,
			},
		},
	);
	return response.data;
}

export async function sponsorAPI(address: string) {
	const response = await axiosInstance.post('/api/auth/user/sponsor/', { address: address });
	return response.data;
}
