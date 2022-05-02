import React, { createContext, PropsWithChildren, useCallback, useEffect, useRef, useState } from 'react';
import { getChainList } from '../api';
import { Chain } from '../types';

export const ChainListContext = createContext<{
  chainList: Chain[];
  updateChainList: (() => Promise<void>) | null;
}>({ chainList: [], updateChainList: null });

export function ChainListProvider({ children, address }: PropsWithChildren<{ address: string | null | undefined }>) {
  const mounted = useRef(false);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  const [chainList, setChainList] = useState<Chain[]>([]);
  const updateChainList = useCallback(async () => {
    const newChainList = await getChainList(address);
    if (mounted.current) {
      setChainList(newChainList);
    }
  }, [address, mounted]);

  useEffect(() => {
    let mounted = true;
    updateChainList();
    return () => {
      mounted = false;
    };
  }, [address, updateChainList]);

  return <ChainListContext.Provider value={{ chainList, updateChainList }}>{children} </ChainListContext.Provider>;
}
