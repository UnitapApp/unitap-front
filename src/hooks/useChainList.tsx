import React, {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { getChainList } from 'api';
import { Chain } from 'types';
import Fuse from 'fuse.js';
import { UserProfileContext } from './useUserProfile';

export const ChainListContext = createContext<{
  chainList: Chain[];
  updateChainList: (() => Promise<void>) | null;
  chainListSearchResult: Chain[];
  changeSearchPhrase: ((newSearchPhrase: string) => void) | null;
}>({ chainList: [], updateChainList: null, chainListSearchResult: [], changeSearchPhrase: null });

export function ChainListProvider({ children, address }: PropsWithChildren<{ address: string | null | undefined }>) {
  const mounted = useRef(false);

  const [chainList, setChainList] = useState<Chain[]>([]);
  const [searchPhrase, setSearchPhrase] = useState<string>('');
  const { userProfile } = useContext(UserProfileContext);
  const updateChainList = useCallback(async () => {
    const newChainList = await getChainList(
      // use address only if userprofile is loaded
      userProfile ? address : null,
    );
    if (mounted.current) {
      setChainList(newChainList);
    }
  }, [address, userProfile, mounted]);

  useEffect(() => {
    mounted.current = true;
    updateChainList();
    return () => {
      mounted.current = false;
    };
  }, [address, updateChainList]);

  const chainListSearchResult = useMemo(() => {
    if (searchPhrase === '') return chainList;
    const fuseOptions = {
      // isCaseSensitive: false,
      // includeScore: false,
      // shouldSort: true,
      // includeMatches: false,
      // findAllMatches: false,
      // minMatchCharLength: 1,
      // location: 0,
      threshold: 0.2, // threshoud is between 0 and 1 where 0 is strict and 1 is accepting anything
      // distance: 100,
      // useExtendedSearch: false,
      // ignoreLocation: false,
      // ignoreFieldNorm: false,
      // fieldNormWeight: 1,
      keys: ['nativeCurrencyName', 'chainName'],
    };
    const fuse = new Fuse(chainList, fuseOptions);
    return fuse.search(searchPhrase).flatMap((serachResult) => serachResult.item);
  }, [searchPhrase, chainList]);

  const changeSearchPhrase = (newSearchPhrase: string) => {
    setSearchPhrase(newSearchPhrase);
  };

  return (
    <ChainListContext.Provider
      value={{
        chainList,
        updateChainList,
        chainListSearchResult,
        changeSearchPhrase,
      }}
    >
      {children}{' '}
    </ChainListContext.Provider>
  );
}
