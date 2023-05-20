import React, {createContext, ReactNode, useState} from 'react';

export const TokenTapContext = createContext<{
  tokensList: string[];
}>({
  tokensList: [],
});

const TokenTapProvider = ({children}: {children: ReactNode}) => {
  const [tokensList, setTokensList] = useState<string[]>([]);

  return (
    <TokenTapContext.Provider value={{tokensList}}>
      {children}
    </TokenTapContext.Provider>
  );
};

export default TokenTapProvider;