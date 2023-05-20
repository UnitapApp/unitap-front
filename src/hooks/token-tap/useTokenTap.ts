import { useContext } from 'react';
import { TokenTapContext } from './tokenTapContext';

export function useTokenTap() {
  const context = useContext(TokenTapContext);

  if (!context) {
    throw new Error('useMyContext must be used within a MyContextProvider');
  }

  return context;
}