import React, { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { claimTokenAPI, getClaimedTokensListAPI, getTokensListAPI } from '../../api';
import { ClaimedToken, Token, TokenClaimPayload } from '../../types';
import { RefreshContext } from '../../context/RefreshContext';
import useToken from '../useToken';
import { useWeb3React } from '@web3-react/core';
import { useEVMTokenTapContract } from '../useContract';
import { useTokenTapClaimTokenCallback } from './useTokenTapClaimTokenCallback';

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
	searchPhrase: string;
	changeSearchPhrase: ((newSearchPhrase: string) => void) | null;
	tokenListSearchResult: Token[];
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
	searchPhrase: '',
	changeSearchPhrase: null,
	tokenListSearchResult: [],
});

const TokenTapProvider = ({ children }: { children: ReactNode }) => {
	const { fastRefresh } = useContext(RefreshContext);
	const [userToken] = useToken();

	const [tokensList, setTokensList] = useState<Token[]>([]);
	const [tokensListLoading, setTokensListLoading] = useState<boolean>(false);
	const [claimTokenSignatureLoading, setClaimTokenSignatureLoading] = useState<boolean>(false);
	const [searchPhrase, setSearchPhrase] = useState<string>('');

	const [claimedTokensList, setClaimedTokensList] = useState<ClaimedToken[]>([]);

	const [selectedTokenForClaim, setSelectedTokenForClaim] = useState<Token | null>(null);
	const [claimTokenLoading, setClaimTokenLoading] = useState<boolean>(false);

	const { provider } = useWeb3React();
	const EVMTokenTapContract = useEVMTokenTapContract();

	const [claimTokenPayload, setClaimTokenPayload] = useState<TokenClaimPayload | null>(null);
	const [claimTokenWithMetamaskResponse, setClaimTokenWithMetamaskResponse] = useState<any | null>(null);

	const tokenListSearchResult = useMemo(() => {
		const searchPhraseLowerCase = searchPhrase.toLowerCase();
		return tokensList.filter((token) => token.name.toLowerCase().includes(searchPhraseLowerCase));
	}, [searchPhrase, tokensList]);

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

	const claimTokenWithMetamask = useCallback(async () => {
		if (!userToken || !provider || !EVMTokenTapContract) return;
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
							message: 'Something went wrong. Please try again!',
						});
						setClaimTokenLoading(false);
					});
			}
		} catch (e: any) {
			setClaimTokenWithMetamaskResponse({
				success: false,
				state: 'Retry',
				message: 'Something went wrong. Please try again!',
			});
			setClaimTokenLoading(false);
		}
	}, [userToken, provider, EVMTokenTapContract, callback]);

	const claimToken = useCallback(
		async (token: Token) => {
			if (!userToken) return;
			setClaimTokenSignatureLoading(true);
			try {
				const response = await claimTokenAPI(userToken, token.id);
				setClaimedTokensList([...claimedTokensList, response]);
				setClaimTokenSignatureLoading(false);
			} catch (e) {
				setClaimTokenSignatureLoading(false);
			}
		},
		[userToken, claimedTokensList],
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

	useEffect(() => {
		if (!selectedTokenForClaim) return;
		let relatedClaimedToken = claimedTokensList.find(
			(claimedToken) => claimedToken.tokenDistribution.id === selectedTokenForClaim.id,
		);
		if (relatedClaimedToken) {
			setClaimTokenPayload(relatedClaimedToken.payload);
		}
	}, [claimedTokensList, selectedTokenForClaim]);

	const handleClaimToken = useCallback(async () => {
		if (!selectedTokenForClaim || claimTokenLoading) return;
		claimTokenWithMetamask();
	}, [selectedTokenForClaim, claimTokenLoading, claimTokenWithMetamask]);

	return (
		<TokenTapContext.Provider
			value={{
				tokensList,
				tokenListSearchResult,
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
				searchPhrase,
				changeSearchPhrase: setSearchPhrase,
			}}
		>
			{children}
		</TokenTapContext.Provider>
	);
};

export default TokenTapProvider;
