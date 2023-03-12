import { Chain, ClaimReceipt, UserProfile } from 'types';
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
  const response = await axiosInstance.post<UserProfile>(`/api/test/user/login/`, { username: address, password: signature});
  return response.data;
}

export async function createUserProfile(address: string) {
  const response = await axiosInstance.post<UserProfile>(`/api/v1/user/create/`, { address });
  return response.data;
}

export async function claimMax(token: string, chainPk: number) {
  const response = await axiosInstance.post<ClaimReceipt>(`/api/v1/chain/${chainPk}/claim-max/`, null, {
    headers: {
      'Authorization': `Token ${token}`,
    }
  });
  return response.data;
}

export async function claimMaxNonEVMAPI(token: string, chainPk: number, account: string) {
  let newAccount = account;
  if (account.slice(0, 2) !== '0x' || account.slice(0, 2) !== '0X' && (account.slice(0, 3) === 'xdc' || account.slice(0, 3) === 'XDC')) {
    newAccount = '0x' + account.slice(3, account.length)
  }
  const response = await axiosInstance.post<ClaimReceipt>(`/api/v1/chain/${chainPk}/claim-max/`, { address: newAccount }, {
    headers: {
      'Authorization': `Token ${token}`,
    }
  });
  return response.data;
}

export async function getActiveClaimHistory(token: string) {
  const date = new Date();
  const lastMonday = getLastMonday(date).toISOString();
  const response = await axiosInstance.get<ClaimReceipt[]>('/api/v1/user/claims/', {
    headers: {
      'Authorization': `Token ${token}`,
    }
  });
  
  return response.data.filter((claim) => claim.datetime >= lastMonday);
}

export async function getUserProfileWithTokenAPI(token: string) {
  const response = await axiosInstance.get<UserProfile>(`/api/test/user/info/`, {
    headers: {
      'Authorization': `Token ${token}`,
    }
  });
  return response.data;
}

export async function getWeeklyChainClaimLimitAPI(token: string) {
  const response = await axiosInstance.get<number>('/api/v1/settings/', {
    headers: {
      'Authorization': `Token ${token}`,
    }
  })
  return response.data;
}

export async function getRemainingClaimsAPI(token: string) {
  const response = await axiosInstance.get('/api/v1/user/remainig-claims/', {
    headers: {
      'Authorization': `Token ${token}`,
    }
  })
  return response.data;
}

export async function setWalletAPI(token: string, wallet: string, walletType: string) {
  const response = await axiosInstance.post('/api/test/user/set-wallet/', { wallet_type: walletType, address: wallet }, {
    headers: {
      'Authorization': `Token ${token}`,
    }
  })
  return response.data;
}

export async function sponsorAPI(address: string) {
  const response = await axiosInstance.post('/api/test/user/sponsor/', {address: address})
  return response.data;
}
