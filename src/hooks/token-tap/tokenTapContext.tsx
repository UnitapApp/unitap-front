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
  claimTokenSignatureLoading: boolean;
  claimedTokensList: ClaimedToken[];
  handleClaimToken: () => void;
  selectedTokenForClaim: Token | null;
  setSelectedTokenForClaim: (token: Token | null) => void;
  claimTokenLoading: boolean;
  openClaimModal: (token: Token) => void;
  closeClaimModal: () => void;
  claimToken: (token: Token) => void;
  claimTokenWithMetamaskResponse: any | null;
}>({
  tokensList: [],
  tokensListLoading: false,
  claimTokenSignatureLoading: false,
  claimedTokensList: [],
  handleClaimToken: () => {},
  selectedTokenForClaim: null,
  setSelectedTokenForClaim: () => {},
  claimTokenLoading: false,
  openClaimModal: () => {},
  closeClaimModal: () => {},
  claimToken: () => {},
  claimTokenWithMetamaskResponse: null,
});

const TokenTapProvider = ({ children }: { children: ReactNode }) => {
  const { fastRefresh } = useContext(RefreshContext);
  const [userToken] = useToken();

  const [tokensList, setTokensList] = useState<Token[]>([]);
  const [tokensListLoading, setTokensListLoading] = useState<boolean>(false);
  const [claimTokenSignatureLoading, setClaimTokenSignatureLoading] = useState<boolean>(false);

  const [claimedTokensList, setClaimedTokensList] = useState<ClaimedToken[]>([]);

  const [selectedTokenForClaim, setSelectedTokenForClaim] = useState<Token | null>(null);
  const [claimTokenLoading, setClaimTokenLoading] = useState<boolean>(false);

  const { provider } = useWeb3React();
  const EVMTokenTapContract = useEVMTokenTapContract();

  const [claimTokenPayload, setClaimTokenPayload] = useState<TokenClaimPayload | null>(null);
  const [claimTokenWithMetamaskResponse, setClaimTokenWithMetamaskResponse] = useState<any | null>(null);

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
        setClaimTokenLoading(true);
        const response = await callback?.();
        if (response) {
          response
            .wait()
            .then((res) => {
              setClaimTokenWithMetamaskResponse({
                success: true,
                state: 'Done',
                txHash: res.transactionHash,
                message: 'Token claimed successfully.',
              });
              setClaimTokenLoading(false);
            })
            .catch(() => {
              setClaimTokenWithMetamaskResponse({
                success: false,
                state: 'Retry',
                message: 'Something went wrong. Please try again. You may have already claimed this token!',
              });
              setClaimTokenLoading(false);
            });
        }
      } catch (e: any) {
        setClaimTokenWithMetamaskResponse({
          success: false,
          state: 'Retry',
          message: 'Something went wrong. Please try again. You may have already claimed this token!',
        });
        setClaimTokenLoading(false);
      }
    },
    [userToken, provider, EVMTokenTapContract, callback],
  );

  const claimToken = useCallback(
    async (token: Token) => {
      if (!userToken) return;
      setClaimTokenSignatureLoading(true);
      try {
        await claimTokenAPI(userToken, token.id);
        setClaimTokenSignatureLoading(false);
      } catch (e) {
        setClaimTokenSignatureLoading(false);
      }
    },
    [userToken],
  );

  const openClaimModal = useCallback(
    (token: Token) => {
      setClaimTokenWithMetamaskResponse(null);
      claimToken(token);
      setSelectedTokenForClaim(token);
    },
    [claimToken, setSelectedTokenForClaim, setClaimTokenWithMetamaskResponse],
  );

  const closeClaimModal = useCallback(() => {
    setClaimTokenWithMetamaskResponse(null);
    setSelectedTokenForClaim(null);
  }, []);

  const handleClaimToken = useCallback(async () => {
    if (!selectedTokenForClaim || claimTokenLoading) return;
    claimTokenWithMetamask(
      claimedTokensList.find((claimedToken) => claimedToken.tokenDistribution.id === selectedTokenForClaim.id)!,
    );
  }, [claimedTokensList, selectedTokenForClaim, claimTokenWithMetamask, claimTokenLoading]);

  return (
    <TokenTapContext.Provider
      value={{
        tokensList,
        tokensListLoading,
        claimTokenSignatureLoading,
        claimedTokensList,
        handleClaimToken,
        selectedTokenForClaim,
        setSelectedTokenForClaim,
        claimTokenLoading,
        openClaimModal,
        closeClaimModal,
        claimToken,
        claimTokenWithMetamaskResponse,
      }}
    >
      {children}
    </TokenTapContext.Provider>
  );
};

export default TokenTapProvider;
