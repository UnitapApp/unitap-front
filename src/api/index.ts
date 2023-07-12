import { Chain, ClaimReceipt, UserProfile, Token, ClaimedToken, ClaimTokenResponse, Settings ,Prize, EnrollmentSignature } from 'types';
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
	const response = await axiosInstance.get<Settings>('/api/v1/settings/');
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

export async function getTokensListAPI() {
	const response = await axiosInstance.get<Token[]>('/api/tokentap/token-distribution-list/');
	return response.data;
}

export async function getClaimedTokensListAPI(token: string) {
	const response = await axiosInstance.get<ClaimedToken[]>('/api/tokentap/claims-list/', {
		headers: {
			Authorization: `Token ${token}`,
		},
	});
	return response.data;
}

export async function claimTokenAPI(token: string, tokenId: number, body?: any) {
	const response = await axiosInstance.post<ClaimTokenResponse>(
		`/api/tokentap/token-distribution/${tokenId}/claim/`,
		body ?? {},
		{
			headers: {
				Authorization: `Token ${token}`,
			},
		},
	);
	return response.data.signature;
}

export async function updateClaimFinished(token: string, claimId: number, txHash: string) {
	const response = await axiosInstance.post<any>(
		`/api/tokentap/claims-list/${claimId}/update/`,
		{ txHash },
		{
			headers: {
				Authorization: `Token ${token}`,
			},
		},
	);
	return response.data;
}

export async function getRafflesListAPI(token: string | null) {
	if(token) {
		const response = await axiosInstance.get<Prize[]>('/api/prizetap/raffle-list/', {
			headers: {
				Authorization: `Token ${token}`,
			},
		});
		return response.data;
	}
	const response = await axiosInstance.get<Prize[]>('/api/prizetap/raffle-list/');
	return response.data;
}

export async function updateEnrolledFinished(token: string, raffleID: string | undefined , txHash: string) {
	const response = await axiosInstance.post<any>(
		`api/prizetap/set-enrollment-tx/${raffleID}`,
		{ txHash },
		{
			headers: {
				Authorization: `Token ${token}`,
			},
		},
	);
	return response.data;
}


export async function updateClaimPrizeFinished(token: string, raffleID: string | undefined , txHash: string) {
	const response = await axiosInstance.post<any>(
		`api/prizetap/set-claiming-prize-tx/${raffleID}`,
		{ txHash },
		{
			headers: {
				Authorization: `Token ${token}`,
			},
		},
	);
	return response.data;
}

export async function getEnrollmentApi(token: string, raffleID: string) {
  const response = await axiosInstance.post<EnrollmentSignature>(`/api/prizetap/raffle-enrollment/${raffleID}/`, null, {
    headers: {
      'Authorization': `Token ${token}`
    }
  })
  return response.data;
}


export async function getClaimPrizeApi(token: string, raffleID: string) {
  const response = await axiosInstance.post<EnrollmentSignature>(`/api/prizetap/claim-prize/${raffleID}/`, null, {
    headers: {
      'Authorization': `Token ${token}`
    }
  })
  return response.data;
}

