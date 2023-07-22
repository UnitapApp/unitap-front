import React, { createContext, ReactNode, useCallback, useContext, useEffect, useState } from 'react';
import {
	getClaimPrizeApi,
	getEnrollmentApi,
	getRafflesListAPI,
	updateClaimPrizeFinished,
	updateEnrolledFinished,
} from '../../api';
import { Prize, UserEntryInRaffle } from '../../types';
import { RefreshContext } from '../../context/RefreshContext';
import { useWeb3React } from '@web3-react/core';
import { useUnitapPrizeCallback } from './useUnitapPrizeCallback';
import { UserProfileContext } from 'hooks/useUserProfile';

export const PrizeTapContext = createContext<{
	rafflesList: Prize[];
	rafflesListLoading: boolean;
	claimOrEnrollSignatureLoading: boolean;
	handleClaimPrize: () => void;
	handleEnroll: () => void;
	selectedRaffleForEnroll: Prize | null;
	setSelectedRaffleForEnroll: (raffle: Prize | null) => void;
	claimOrEnrollLoading: boolean;
	openEnrollModal: (raffle: Prize, method: string | null) => void;
	closeEnrollModal: () => void;
	claimError: string | null;
	claimOrEnrollWithMetamaskResponse: any | null;
	method: string | null;
	setMethod: (method: string | null) => void;
}>({
	claimError: null,
	rafflesList: [],
	rafflesListLoading: false,
	claimOrEnrollSignatureLoading: false,
	handleClaimPrize: () => {},
	handleEnroll: () => {},
	selectedRaffleForEnroll: null,
	setSelectedRaffleForEnroll: () => {},
	claimOrEnrollLoading: false,
	openEnrollModal: () => {},
	closeEnrollModal: () => {},
	claimOrEnrollWithMetamaskResponse: null,
	method: null,
	setMethod: () => {},
});

const PrizeTapProvider = ({ children }: { children: ReactNode }) => {
	const { fastRefresh } = useContext(RefreshContext);
	const { userProfile } = useContext(UserProfileContext);
	const [rafflesList, setRafflesList] = useState<Prize[]>([]);
	const [claimError, setClaimError] = useState<string | null>(null);

	const [rafflesListLoading, setRafflesListLoading] = useState<boolean>(false);
	const [claimOrEnrollSignatureLoading, setClaimOrEnrollSignatureLoading] = useState<boolean>(false);
	const [selectedRaffleForEnroll, setSelectedRaffleForEnroll] = useState<Prize | null>(null);
	const [claimOrEnrollLoading, setClaimOrEnrollLoading] = useState<boolean>(false);

	const { provider } = useWeb3React();

	const [enrollOrClaimPayload, setEnrollOrClaimPayload] = useState<UserEntryInRaffle | null>(null);
	const [claimOrEnrollWithMetamaskResponse, setClaimOrEnrollWithMetamaskResponse] = useState<any | null>(null);

	const [method, setMethod] = useState<string | null>(null);

	const getRafflesListWithOutToken = useCallback(async () => {
		setRafflesListLoading(true);
		try {
			const response = await getRafflesListAPI(undefined);
			setRafflesListLoading(false);
			setRafflesList(response);
			console.log(response, 'no user token');
		} catch (e: any) {
			setRafflesListLoading(false);
			setClaimError(e.response?.data.message);
			console.log(e);
		}
	}, []);

	const getRafflesListWithToken = useCallback(async () => {
		setRafflesListLoading(true);
		try {
			const response = await getRafflesListAPI(userProfile?.token);
			setRafflesListLoading(false);
			setRafflesList(response);
			console.log(response, 'with token');
		} catch (e: any) {
			setRafflesListLoading(false);
			setClaimError(e.response?.data.message);
			console.log(e);
		}
	}, [userProfile]);

	useEffect(() => {
		if (userProfile) {
			getRafflesListWithToken();
		} else {
			getRafflesListWithOutToken();
		}
	}, [getRafflesListWithToken, getRafflesListWithOutToken, fastRefresh, userProfile]);

	const { callback } = useUnitapPrizeCallback(
		selectedRaffleForEnroll?.raffleId,
		enrollOrClaimPayload?.nonce,
		enrollOrClaimPayload?.signature,
		enrollOrClaimPayload?.multiplier,
		method,
		selectedRaffleForEnroll?.contract,
		selectedRaffleForEnroll?.isPrizeNft,
	);

	const claimOrEnrollWithMetamask = useCallback(async () => {
		if (!userProfile || !provider || !useUnitapPrizeCallback) return;
		const id = selectedRaffleForEnroll?.userEntry?.pk;
		const setClaimHashId = selectedRaffleForEnroll?.pk;
		try {
			setClaimOrEnrollLoading(true);

			const response = await callback?.();
			if (response) {
				response
					.wait()
					.then((res) => {
						setClaimOrEnrollWithMetamaskResponse({
							success: true,
							state: 'Done',
							txHash: res.transactionHash,
							message: method === 'Claim' ? 'Claimed successfully.' : 'Enrolled successfully',
						});
						method === 'Enroll'
							? updateEnrolledFinished(userProfile.token, id, res.transactionHash)
							: updateClaimPrizeFinished(userProfile.token, setClaimHashId, res.transactionHash);
						setClaimOrEnrollLoading(false);
					})
					.catch(() => {
						setClaimOrEnrollWithMetamaskResponse({
							success: false,
							state: 'Retry',
							message: 'Something went wrong. Please try again!',
						});
						setClaimOrEnrollLoading(false);
					});
			}
		} catch (e: any) {
			console.log(e);
			setClaimOrEnrollWithMetamaskResponse({
				success: false,
				state: 'Retry',
				message: 'Something went wrong. Please try again!',
			});
			setClaimOrEnrollLoading(false);
		}
	}, [userProfile, provider, callback, method, selectedRaffleForEnroll]);

	const openEnrollModal = useCallback(
		(raffle: Prize, method: string | null) => {
			setClaimOrEnrollWithMetamaskResponse(null);
			setMethod(method);
			setSelectedRaffleForEnroll(raffle);
		},
		[setSelectedRaffleForEnroll, setClaimOrEnrollWithMetamaskResponse],
	);

	const closeEnrollModal = useCallback(() => {
		setClaimOrEnrollWithMetamaskResponse(null);
		setSelectedRaffleForEnroll(null);
	}, []);

	useEffect(() => {
		if (!selectedRaffleForEnroll || !userProfile) {
			return;
		}
		const getSignature = async () => {
			setClaimOrEnrollSignatureLoading(true);
			let response;
			if (method === 'Enroll') {
				if (selectedRaffleForEnroll.isExpired) return;
				if (selectedRaffleForEnroll.userEntry) {
					setEnrollOrClaimPayload(selectedRaffleForEnroll.userEntry);
					setClaimOrEnrollSignatureLoading(false);
				} else {
					try {
						response = await getEnrollmentApi(userProfile.token, selectedRaffleForEnroll.pk);
						selectedRaffleForEnroll.userEntry = response.signature;
						setEnrollOrClaimPayload(response.signature);
						setClaimOrEnrollSignatureLoading(false);
					} catch (e: any) {
						setClaimError(e.response?.data.message);
						setClaimOrEnrollSignatureLoading(false);
					}
				}
			} else {
				try {
					response = await getClaimPrizeApi(userProfile.token, selectedRaffleForEnroll.pk);
					response.nonce = 1;
					response.multiplier = 1;
					setEnrollOrClaimPayload(response);
					setClaimOrEnrollSignatureLoading(false);
				} catch (e: any) {
					setClaimError(e.response?.data.message);
					setClaimOrEnrollSignatureLoading(false);
				}
			}
		};
		getSignature();
	}, [selectedRaffleForEnroll, userProfile, method]);

	const handleClaimPrize = useCallback(async () => {
		if (!selectedRaffleForEnroll || claimOrEnrollLoading) return;
		claimOrEnrollWithMetamask();
	}, [selectedRaffleForEnroll, claimOrEnrollLoading, claimOrEnrollWithMetamask]);

	const handleEnroll = useCallback(async () => {
		if (!selectedRaffleForEnroll || claimOrEnrollLoading) return;
		claimOrEnrollWithMetamask();
	}, [selectedRaffleForEnroll, claimOrEnrollLoading, claimOrEnrollWithMetamask]);

	return (
		<PrizeTapContext.Provider
			value={{
				claimError,
				rafflesList,
				rafflesListLoading,
				claimOrEnrollSignatureLoading,
				handleClaimPrize,
				handleEnroll,
				selectedRaffleForEnroll,
				setSelectedRaffleForEnroll,
				claimOrEnrollLoading,
				openEnrollModal,
				closeEnrollModal,
				claimOrEnrollWithMetamaskResponse,
				method,
				setMethod,
			}}
		>
			{children}
		</PrizeTapContext.Provider>
	);
};

export default PrizeTapProvider;
