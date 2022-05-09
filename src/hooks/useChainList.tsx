import React, { createContext, PropsWithChildren, useCallback, useEffect, useRef, useState } from 'react';
import { getChainList } from 'api';
import { Chain } from 'types';

export const ChainListContext = createContext<{
  chainList: Chain[];
  updateChainList: (() => Promise<void>) | null;
}>({ chainList: [], updateChainList: null });

export function ChainListProvider({ children, address }: PropsWithChildren<{ address: string | null | undefined }>) {
  const mounted = useRef(false);

  const [chainList, setChainList] = useState<Chain[]>([]);
  const updateChainList = useCallback(async () => {
    const newChainList = await getChainList(address);
    if (mounted.current) {
      setChainList(newChainList);
    }
  }, [address, mounted]);

  useEffect(() => {
    mounted.current = true;
    updateChainList();
    return () => {
      mounted.current = false;
    };
  }, [address, updateChainList]);

  return <ChainListContext.Provider value={{ chainList, updateChainList }}>{children} </ChainListContext.Provider>;
}
