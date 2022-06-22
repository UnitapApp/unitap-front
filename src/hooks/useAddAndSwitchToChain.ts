import useActiveWeb3React from './useActiveWeb3React';
import { useCallback } from 'react';
import { Chain } from '../types';
import { switchToNetwork } from '../utils/switchToNetwork';

export const useAddAndSwitchToChain = () => {
  const { library, active, chainId } = useActiveWeb3React();
  const addAndSwitchToChain = useCallback(
    async (chain: Chain) => {
      if (!library?.provider || !active) return false;
      if (String(chainId) === chain.chainId) return;
      await switchToNetwork({ provider: library.provider, chain });
      return true;
    },
    [active, chainId, library],
  );
  return { addAndSwitchToChain };
};
