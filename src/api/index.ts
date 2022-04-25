import { Chain, UserProfile } from '../types';
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: process.env.NODE_ENV === 'development' ? '' : 'http://168.119.127.117:4549/',
});

export async function getChainList() {
  const response = await axiosInstance.get<Chain[]>('/api/v1/chain/list/');
  return response.data;
}

export async function getUserProfile(address: string) {
  const response = await axiosInstance.get<UserProfile>(`/api/v1/user/${address}/`);
  return response.data;
}

export async function createUserProfile(address: string) {
  const response = await axiosInstance.post<UserProfile>(`/api/v1/user/create/`, { address });
  return response.data;
}
