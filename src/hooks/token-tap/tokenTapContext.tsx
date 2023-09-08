import { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { claimTokenAPI, getClaimedTokensListAPI, getTokensListAPI, updateClaimFinished } from '../../api';
import { ClaimedToken, PK, Token, TokenClaimPayload } from '../../types';
import { RefreshContext } from '../../context/RefreshContext';
import { useWeb3React } from '@web3-react/core';
import { useEVMTokenTapContract } from '../useContract';
import { claimTokenCallback } from './tokenTapClaimToken';
import { useTransactionAdder } from 'state/transactions/hooks';
import { UserProfileContext } from 'hooks/useUserProfile';

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
	claimToken: (token: Token, body?: any) => void;
	claimError: string | null;
	claimTokenWithMetamaskResponse: any | null;
	searchPhrase: string;
	changeSearchPhrase: ((newSearchPhrase: string) => void) | null;
	tokenListSearchResult: Token[];
	claimingTokenPk: PK | null;
}>({
	claimError: null,
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
	claimingTokenPk: null,
});

const TokenTapProvider = ({ children }: { children: ReactNode }) => {
	const { fastRefresh } = useContext(RefreshContext);

	const [tokensList, setTokensList] = useState<Token[]>([]);
	const [claimError, setClaimError] = useState<string | null>(null);

	const [tokensListLoading, setTokensListLoading] = useState<boolean>(false);
	const [claimTokenSignatureLoading, setClaimTokenSignatureLoading] = useState<boolean>(false);
	const [searchPhrase, setSearchPhrase] = useState<string>('');
	const addTransaction = useTransactionAdder();

	const [claimedTokensList, setClaimedTokensList] = useState<ClaimedToken[]>([]);

	const [selectedTokenForClaim, setSelectedTokenForClaim] = useState<Token | null>(null);
	const [claimTokenLoading, setClaimTokenLoading] = useState<boolean>(false);
	const [claimingTokenPk, setClaimingTokenPk] = useState<PK | null>(null);

	const { provider, account, chainId } = useWeb3React();
	const EVMTokenTapContract = useEVMTokenTapContract();

	const { userToken } = useContext(UserProfileContext);

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
	}, [getClaimedTokensList, fastRefresh, userToken]);

	const claimToken = useCallback(
		async (token: Token, body?: any) => {
			if (!userToken) return;
			setClaimError(null);
			setClaimTokenSignatureLoading(true);
			try {
				const response = await claimTokenAPI(userToken, token.id, body);
				setClaimedTokensList([...claimedTokensList, response]);
				setClaimTokenSignatureLoading(false);

				return response;
			} catch (e: any) {
				// setClaimError(e.response?.data.message);
				setClaimTokenSignatureLoading(false);
			}
		},
		[userToken, claimedTokensList, setClaimError],
	);

	const claimTokenWithMetamask = useCallback(
		async (claimTokenPayload?: TokenClaimPayload, claimId?: number) => {
			if (!userToken || !provider || !EVMTokenTapContract) return;

			const claimAddress = selectedTokenForClaim!.chain.tokentapContractAddress;

			try {
				const res = await claimToken(selectedTokenForClaim!);

				const txPayload = res?.payload ?? claimTokenPayload;

				if (!txPayload || !account || !chainId || !claimAddress) {
					return;
				}

				if (!claimId) claimId = res!.id;

				const response = await claimTokenCallback(
					txPayload.user,
					txPayload.token,
					txPayload.amount,
					txPayload.nonce,
					txPayload.signature,
					EVMTokenTapContract,
					account,
					chainId,
					provider,
					addTransaction,
					claimAddress,
				);

				setClaimTokenLoading(true);
				setClaimingTokenPk(selectedTokenForClaim!.id);

				if (response) {
					response
						.wait()
						.then(async (res) => {
							setClaimTokenWithMetamaskResponse({
								success: true,
								state: 'Done',
								txHash: res.transactionHash,
								message: 'Token claimed successfully.',
							});
							await updateClaimFinished(userToken, claimId!, res.transactionHash);
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
		},
		[userToken, provider, selectedTokenForClaim, claimToken, EVMTokenTapContract, account, addTransaction, chainId],
	);

	const openClaimModal = useCallback(
		(token: Token) => {
			setClaimTokenWithMetamaskResponse(null);
			setSelectedTokenForClaim(token);
		},
		[setSelectedTokenForClaim, setClaimTokenWithMetamaskResponse],
	);

	const closeClaimModal = useCallback(() => {
		setClaimTokenWithMetamaskResponse(null);
		setSelectedTokenForClaim(null);
	}, []);

	const handleClaimToken = useCallback(async () => {
		if (!selectedTokenForClaim || claimTokenLoading) return;

		const relatedClaimedToken = claimedTokensList.find(
			(claimedToken) => claimedToken.tokenDistribution.id === selectedTokenForClaim.id,
		);

		claimTokenWithMetamask(relatedClaimedToken?.payload, relatedClaimedToken?.id);
	}, [selectedTokenForClaim, claimedTokensList, claimTokenLoading, claimTokenWithMetamask]);

	return (
		<TokenTapContext.Provider
			value={{
				claimError,
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
				claimingTokenPk,
			}}
		>
			{children}
		</TokenTapContext.Provider>
	);
};

export default TokenTapProvider;
