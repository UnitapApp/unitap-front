import React, { createContext, ReactNode, useCallback, useContext, useEffect, useState } from 'react';
import { claimTokenAPI, getClaimedTokensListAPI, getTokensListAPI } from '../../api';
import { ClaimedToken, Token } from '../../types';
import { RefreshContext } from '../../context/RefreshContext';
import useToken from '../useToken';
import { useWeb3React } from '@web3-react/core';
import { useEVMTokenTapContract } from '../useContract';
import { BigNumber } from '@ethersproject/bignumber';
import { useTokenTapClaimTokenCallback } from './useTokenTapClaimTokenCallback';

export const TokenTapContext = createContext<{
  tokensList: Token[];
  tokensListLoading: boolean;
  claimedTokensList: ClaimedToken[];
  handleClaimToken: () => void;
  selectedTokenForClaim: Token | null;
  setSelectedTokenForClaim: (token: Token | null) => void;
  claimTokenLoading: boolean;
}>({
  tokensList: [],
  tokensListLoading: false,
  claimedTokensList: [],
  handleClaimToken: () => {},
  selectedTokenForClaim: null,
  setSelectedTokenForClaim: () => {},
  claimTokenLoading: false,
});

const TokenTapProvider = ({ children }: { children: ReactNode }) => {
  const { fastRefresh } = useContext(RefreshContext);
  const [userToken] = useToken();

  const [tokensList, setTokensList] = useState<Token[]>([]);
  const [tokensListLoading, setTokensListLoading] = useState<boolean>(false);

  const [claimedTokensList, setClaimedTokensList] = useState<ClaimedToken[]>([]);

  const [selectedTokenForClaim, setSelectedTokenForClaim] = useState<Token | null>(null);
  const [claimTokenLoading, setClaimTokenLoading] = useState<boolean>(false);

  const { provider } = useWeb3React();
  const EVMTokenTapContract = useEVMTokenTapContract();

  const getTokensList = useCallback(async () => {
    setTokensListLoading(true);
    try {
      const response = await getTokensListAPI();
      setTokensListLoading(false);
      setTokensList(response);
    } catch (e) {
      setTokensListLoading(false);
      console.log(e);
    }
  }, []);

  useEffect(() => {
    getTokensList();
  }, [getTokensList, fastRefresh]);

  const getClaimedTokensList = useCallback(async () => {
    if (!userToken) return;
    try {
      const response = await getClaimedTokensListAPI(userToken);
      setClaimedTokensList(response);
    } catch (e) {
      console.log(e);
    }
  }, [userToken]);

  useEffect(() => {
    getClaimedTokensList();
  }, [getClaimedTokensList, fastRefresh]);

  const { callback } = useTokenTapClaimTokenCallback(
    '0x2BA839C06Df087a5a2c9d133769ad5E7e339744F',
    '0x83ff60e2f93f8edd0637ef669c69d5fb4f64ca8e',
    BigNumber.from(10).pow(18),
    801796867,
    '0xe00c241cdb20700ea60f6ea0fa4899c653f8c4ba17bf07a933d765bc50f7012c2b83f8e5757980b7e3f3035b0e186051d5c8d9b5769c237b362c50c58f9346651c',
  );

  const claimTokenWithMetamask = useCallback(
    async (claimTokenResponse: ClaimedToken) => {
      if (!userToken || !provider || !EVMTokenTapContract) return;
      try {
        const response = await callback?.();
      } catch (e) {
        console.log(e);
      }
    },
    [userToken, provider, EVMTokenTapContract, callback],
  );

  const claimToken = useCallback(
    async (token: Token) => {
      if (!userToken) return;
      setClaimTokenLoading(true);
      try {
        const response = await claimTokenAPI(userToken, token.id);
        claimTokenWithMetamask(response);
        setClaimTokenLoading(false);
      } catch (e) {
        setClaimTokenLoading(false);
      }
    },
    [userToken, claimTokenWithMetamask],
  );

  const handleClaimToken = useCallback(async () => {
    if (!selectedTokenForClaim) return;
    if (!!claimedTokensList.find((claimedToken) => claimedToken.tokenDistribution.id === selectedTokenForClaim.id)) {
      claimTokenWithMetamask(
        claimedTokensList.find((claimedToken) => claimedToken.tokenDistribution.id === selectedTokenForClaim.id)!,
      );
    } else {
      claimToken(selectedTokenForClaim);
    }
  }, [claimToken, claimedTokensList, selectedTokenForClaim, claimTokenWithMetamask]);

  return (
    <TokenTapContext.Provider
      value={{
        tokensList,
        tokensListLoading,
        claimedTokensList,
        handleClaimToken,
        selectedTokenForClaim,
        setSelectedTokenForClaim,
        claimTokenLoading,
      }}
    >
      {children}
    </TokenTapContext.Provider>
  );
};

export default TokenTapProvider;
