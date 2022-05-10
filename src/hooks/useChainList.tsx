import React, { createContext, PropsWithChildren, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { getChainList } from 'api';
import { Chain } from 'types';
import Fuse from 'fuse.js'

export const ChainListContext = createContext<{
  chainList: Chain[];
  updateChainList: (() => Promise<void>) | null;
  chainListSearchResult: Chain[];
  chageSearchPhrase: ((newSearchPhrase: string) => void) | null;
}>({ chainList: [], updateChainList: null, chainListSearchResult: [], chageSearchPhrase: null });

export function ChainListProvider({ children, address }: PropsWithChildren<{ address: string | null | undefined }>) {
  const mounted = useRef(false);

  const [chainList, setChainList] = useState<Chain[]>([]);
  const [searchPhrase, setSearchPhrase] = useState<string>("");

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

  const chainListSearchResult = useMemo(() => {
    if (searchPhrase === "")
      return chainList;
    const fuseOptions = {
      // isCaseSensitive: false,
      // includeScore: false,
      // shouldSort: true,
      // includeMatches: false,
      // findAllMatches: false,
      // minMatchCharLength: 1,
      // location: 0,
      // threshold: 0.6,
      // distance: 100,
      // useExtendedSearch: false,
      // ignoreLocation: false,
      // ignoreFieldNorm: false,
      // fieldNormWeight: 1,
      keys: [
        "chainName",
        "chainId"
      ]
    };
    const fuse = new Fuse(chainList, fuseOptions);
    return fuse.search(searchPhrase).flatMap((serachResult)=>serachResult.item);
  }, [searchPhrase, chainList])

  const chageSearchPhrase = (newSearchPhrase: string) => {
    setSearchPhrase(newSearchPhrase);
  };

  return <ChainListContext.Provider value={{ chainList, updateChainList, chainListSearchResult, chageSearchPhrase }}>{children} </ChainListContext.Provider>;
}
