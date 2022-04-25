import { Chain } from '../types';
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: process.env.NODE_ENV === 'development' ? '' : 'http://168.119.127.117:4549/',
});

export async function getChainList(): Promise<Chain[]> {
  const response = await axiosInstance.get<Chain[]>('/api/v1/chain/list/');
  return response.data;
}
