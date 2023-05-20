import React, {createContext, ReactNode, useCallback, useEffect, useState} from 'react';
import {getTokensListAPI} from "../../api";
import {Token} from "../../types";

export const TokenTapContext = createContext<{
  tokensList: Token[];
  tokensListLoading: boolean;
}>({
  tokensList: [],
  tokensListLoading: false,
});

const TokenTapProvider = ({children}: {children: ReactNode}) => {
  const [tokensList, setTokensList] = useState<Token[]>([]);
  const [tokensListLoading, setTokensListLoading] = useState<boolean>(false);

  const refreshTokensList = useCallback(async () => {
    setTokensListLoading(true);
    try {
      const response = await getTokensListAPI()
      setTokensListLoading(false);
      setTokensList(response);
    } catch (e) {
      setTokensListLoading(false);
      console.log(e)
    }
  } ,[])

  useEffect(() => {
    refreshTokensList();
  } , [refreshTokensList])

  return (
    <TokenTapContext.Provider value={{tokensList, tokensListLoading}}>
      {children}
    </TokenTapContext.Provider>
  );
};

export default TokenTapProvider;