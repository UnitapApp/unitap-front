import React, { createContext, PropsWithChildren, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { getChainList } from 'api';
import { Chain } from 'types';
import useActiveWeb3React from './useActiveWeb3React';
import { RefreshContext } from 'context/RefreshContext';
import searchChainList from 'utils/hook/searchChainList';
import tryUntilSuccess from 'utils/hook/tryUntilSuccess';

export const FundContext = createContext<{
  chainList: Chain[];
  chainListSearchResult: Chain[];
  changeSearchPhrase: ((newSearchPhrase: string) => void) | null;
}>({
  chainList: [],
  chainListSearchResult: [],
  changeSearchPhrase: null,
});

export function FundProvider({ children }: PropsWithChildren<{}>) {
  const [chainList, setChainList] = useState<Chain[]>([]);
  const [searchPhrase, setSearchPhrase] = useState<string>('');

  const { account: address } = useActiveWeb3React();
  const { fastRefresh } = useContext(RefreshContext);

  const updateChainList = useCallback(async () => {
    const newChainList = await getChainList(address ? address : null);
    setChainList(newChainList);
  }, [address]);

  useEffect(() => tryUntilSuccess(updateChainList), [address, updateChainList, fastRefresh]);

  const chainListSearchResult = useMemo(() => searchChainList(searchPhrase, chainList), [searchPhrase, chainList]);

  const changeSearchPhrase = (newSearchPhrase: string) => {
    setSearchPhrase(newSearchPhrase);
  };

  return (
    <FundContext.Provider
      value={{
        chainList,
        chainListSearchResult,
        changeSearchPhrase,
      }}
    >
      {children}
    </FundContext.Provider>
  );
}
