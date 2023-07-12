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
import useToken from '../useToken';
import { useWeb3React } from '@web3-react/core';
import { useUnitapPrizeCallback } from './useUnitapPrizeCallback';

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
	isEnrolled: boolean;
	isClaimed: boolean;
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
	isEnrolled: false,
	isClaimed: false,
});

const PrizeTapProvider = ({ children }: { children: ReactNode }) => {
	const { fastRefresh } = useContext(RefreshContext);
	const [userToken] = useToken();

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

	const [isEnrolled, setIsEnrolled] = useState<boolean>(false);
	const [isClaimed, setIsClaimed] = useState<boolean>(false);

	const getRafflesList = useCallback(async () => {
		setRafflesListLoading(true);
		if (userToken) {
			try {
				const response = await getRafflesListAPI(userToken);
				setRafflesListLoading(false);
				setRafflesList(response);
				console.log(response);
			} catch (e: any) {
				setRafflesListLoading(false);
				setClaimError(e.response?.data.message);
				console.log(e);
			}
		} else {
			try {
				const response = await getRafflesListAPI(null);
				setRafflesListLoading(false);
				setRafflesList(response);
			} catch (e: any) {
				setRafflesListLoading(false);
				setClaimError(e.response?.data.message);
				console.log(e);
			}
		}
	}, [userToken]);

	useEffect(() => {
		getRafflesList();
	}, [getRafflesList, fastRefresh]);

	const { callback } = useUnitapPrizeCallback(
		selectedRaffleForEnroll?.raffleId,
		enrollOrClaimPayload?.nonce,
		enrollOrClaimPayload?.signature,
		method,
		selectedRaffleForEnroll?.contract,
		selectedRaffleForEnroll?.isPrizeNft,
	);

	const claimOrEnrollWithMetamask = useCallback(async () => {
		if (!userToken || !provider || !useUnitapPrizeCallback) return;

		const id = selectedRaffleForEnroll?.raffleId;

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
							message: method == 'Claim' ? 'Claimed successfully.' : 'Enrolled successfully',
						});
						method == 'Enroll'
							? updateEnrolledFinished(userToken, id, res.transactionHash)
							: updateClaimPrizeFinished(userToken, id, res.transactionHash);
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
			setClaimOrEnrollWithMetamaskResponse({
				success: false,
				state: 'Retry',
				message: 'Something went wrong. Please try again!',
			});
			setClaimOrEnrollLoading(false);
		}
	}, [userToken, provider, callback, method, selectedRaffleForEnroll]);

	const openEnrollModal = useCallback(
		(raffle: Prize, method: string | null) => {
			setClaimOrEnrollWithMetamaskResponse(null);
			setMethod(method);
			setSelectedRaffleForEnroll(raffle);
			if (raffle.userEntry.txHash) {
				setIsEnrolled(true);
			}
			if (raffle.userEntry.claimingPrizeTx) {
				setIsClaimed(true);
			}
		},
		[setSelectedRaffleForEnroll, setClaimOrEnrollWithMetamaskResponse],
	);

	const closeEnrollModal = useCallback(() => {
		setClaimOrEnrollWithMetamaskResponse(null);
		setSelectedRaffleForEnroll(null);
	}, []);

	useEffect(() => {
		if (!selectedRaffleForEnroll || !userToken) {
			return;
		}

		const getSignature = async () => {
			setClaimOrEnrollSignatureLoading(true);
			let response;
			if (method == 'Enroll') {
				if (selectedRaffleForEnroll.userEntry) {
					setEnrollOrClaimPayload(selectedRaffleForEnroll.userEntry);
					setClaimOrEnrollSignatureLoading(false);
				} else {
					try {
						response = await getEnrollmentApi(userToken, selectedRaffleForEnroll.raffleId);
						console.log(response);
						setEnrollOrClaimPayload(response.signature);
						setClaimOrEnrollSignatureLoading(false);
					} catch (e: any) {
						setClaimError(e.response?.data.message);
						setClaimOrEnrollSignatureLoading(false);
					}
				}
			} else {
				try {
					response = await getClaimPrizeApi(userToken, selectedRaffleForEnroll.raffleId);
					console.log(response);
					response.signature.nonce = 1;
					setEnrollOrClaimPayload(response.signature);
					setClaimOrEnrollSignatureLoading(false);
				} catch (e: any) {
					setClaimError(e.response?.data.message);
					setClaimOrEnrollSignatureLoading(false);
				}
			}
		};
		getSignature();
	}, [selectedRaffleForEnroll, userToken, method]);

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
				isEnrolled,
				isClaimed,
			}}
		>
			{children}
		</PrizeTapContext.Provider>
	);
};

export default PrizeTapProvider;
