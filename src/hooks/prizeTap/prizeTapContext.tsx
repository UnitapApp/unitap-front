import { createContext, ReactNode, useCallback, useContext, useEffect, useState } from 'react';
import {
	getEnrollmentApi,
	getMuonApi,
	getRafflesListAPI,
	updateClaimPrizeFinished,
	updateEnrolledFinished,
} from '../../api';
import { EnrollmentSignature, Prize } from '../../types';
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

	const { provider, account } = useWeb3React();

	const [enrollOrClaimPayload, setEnrollOrClaimPayload] = useState<EnrollmentSignature | null>(null);
	const [claimOrEnrollWithMetamaskResponse, setClaimOrEnrollWithMetamaskResponse] = useState<any | null>(null);

	const [method, setMethod] = useState<string | null>(null);

	const getRafflesListWithOutToken = useCallback(async () => {
		setRafflesListLoading(true);
		try {
			const response = await getRafflesListAPI(undefined);
			setRafflesListLoading(false);
			setRafflesList(response);
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
			// console.log(response, 'with token');
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
		enrollOrClaimPayload?.result.data.init.nonceAddress,
		enrollOrClaimPayload?.result.signatures[0].signature,
		enrollOrClaimPayload?.result.signatures[0].owner,
		enrollOrClaimPayload?.result.reqId,
		method,
		selectedRaffleForEnroll?.userEntry?.multiplier,
		selectedRaffleForEnroll?.contract,
		selectedRaffleForEnroll?.isPrizeNft,
		enrollOrClaimPayload?.result.shieldSignature,
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
			if (selectedRaffleForEnroll.isExpired) return;
			let raffleEntryId;
			if (!selectedRaffleForEnroll?.userEntry) {
				const enrollInApi = await getEnrollmentApi(userProfile.token, selectedRaffleForEnroll.pk);
				setSelectedRaffleForEnroll({ ...selectedRaffleForEnroll, userEntry: enrollInApi.signature });
				raffleEntryId = enrollInApi.signature.pk;
			} else {
				raffleEntryId = selectedRaffleForEnroll?.userEntry.pk;
			}

			let response;
			try {
				response = await getMuonApi(raffleEntryId);
				setEnrollOrClaimPayload(response);
				setClaimOrEnrollSignatureLoading(false);
			} catch (e: any) {
				setClaimError(e.response?.data.message);
				setClaimOrEnrollSignatureLoading(false);
			}
		};
		if (method == 'Enroll' && account) {
			getSignature();
		}
		if (method == 'Claim') {
			setEnrollOrClaimPayload({
				result: {
					data: { init: { nonceAddress: '1' } },
					reqId: '1',
					signatures: [{ owner: '1', signature: '1' }],
					shieldSignature: '1',
				},
			});
		}
	}, [selectedRaffleForEnroll, userProfile, method, account]);

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
