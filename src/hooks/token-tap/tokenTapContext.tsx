import React, { createContext, ReactNode, useCallback, useContext, useEffect, useState } from 'react';
import { claimTokenAPI, getClaimedTokensListAPI, getTokensListAPI } from '../../api';
import { ClaimedToken, Token, TokenClaimPayload } from '../../types';
import { RefreshContext } from '../../context/RefreshContext';
import useToken from '../useToken';
import { useWeb3React } from '@web3-react/core';
import { useEVMTokenTapContract } from '../useContract';
import { BigNumber } from '@ethersproject/bignumber';
import { useTokenTapClaimTokenCallback } from './useTokenTapClaimTokenCallback';
import { ethers } from 'ethers';

export const TokenTapContext = createContext<{
  tokensList: Token[];
  tokensListLoading: boolean;
  claimedTokensList: ClaimedToken[];
  handleClaimToken: () => void;
  selectedTokenForClaim: Token | null;
  setSelectedTokenForClaim: (token: Token | null) => void;
  claimTokenLoading: boolean;
  closeClaimModal: () => void;
  claimToken: (token: Token) => void;
}>({
  tokensList: [],
  tokensListLoading: false,
  claimedTokensList: [],
  handleClaimToken: () => {},
  selectedTokenForClaim: null,
  setSelectedTokenForClaim: () => {},
  claimTokenLoading: false,
  closeClaimModal: () => {},
  claimToken: () => {},
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

  const [claimTokenPayload, setClaimTokenPayload] = useState<TokenClaimPayload | null>(null);

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
    claimTokenPayload?.user,
    claimTokenPayload?.token,
    claimTokenPayload?.amount,
    claimTokenPayload?.nonce,
    claimTokenPayload?.signature,
  );

  const claimTokenWithMetamask = useCallback(
    async (claimTokenResponse: ClaimedToken) => {
      if (!userToken || !provider || !EVMTokenTapContract) return;
      setClaimTokenPayload(claimTokenResponse.payload);
      try {
        const response = await callback?.();
        if (response) {
          console.log(response);
        }
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
        await claimTokenAPI(userToken, token.id);
        setClaimTokenLoading(false);
      } catch (e) {
        setClaimTokenLoading(false);
      }
    },
    [userToken],
  );

  const closeClaimModal = useCallback(() => {
    setSelectedTokenForClaim(null);
  }, []);

  const handleClaimToken = useCallback(async () => {
    if (!selectedTokenForClaim) return;

    claimTokenWithMetamask(
      claimedTokensList.find((claimedToken) => claimedToken.tokenDistribution.id === selectedTokenForClaim.id)!,
    );
  }, [claimedTokensList, selectedTokenForClaim, claimTokenWithMetamask]);

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
        closeClaimModal,
        claimToken,
      }}
    >
      {children}
    </TokenTapContext.Provider>
  );
};

export default TokenTapProvider;
