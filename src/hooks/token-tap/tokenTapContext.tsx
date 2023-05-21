import React, {createContext, ReactNode, useCallback, useContext, useEffect, useState} from 'react';
import {getTokensListAPI, getClaimedTokensListAPI} from "../../api";
import {ClaimedToken, Token} from "../../types";
import {RefreshContext} from "../../context/RefreshContext";
import useToken from "../useToken";

export const TokenTapContext = createContext<{
	tokensList: Token[];
	tokensListLoading: boolean;
	claimedTokensList: ClaimedToken[];
}>({
	tokensList: [],
	tokensListLoading: false,
	claimedTokensList: [],
});

const TokenTapProvider = ({children}: { children: ReactNode }) => {
	const [tokensList, setTokensList] = useState<Token[]>([]);
	const [tokensListLoading, setTokensListLoading] = useState<boolean>(false);

	const [claimedTokensList, setClaimedTokensList] = useState<ClaimedToken[]>([]);

	const {fastRefresh} = useContext(RefreshContext);

	const [userToken] = useToken();

	const getTokensList = useCallback(async () => {
		setTokensListLoading(true);
		try {
			const response = await getTokensListAPI()
			setTokensListLoading(false);
			setTokensList(response);
		} catch (e) {
			setTokensListLoading(false);
			console.log(e)
		}
	}, [])

	useEffect(() => {
		getTokensList();
	}, [getTokensList])

	const getClaimedTokensList = useCallback(async () => {
		if (!userToken) return;
		try {
			const response = await getClaimedTokensListAPI(userToken)
			setClaimedTokensList(response);
		} catch (e) {
			console.log(e)
		}
	}, [userToken])

	useEffect(() => {
		getClaimedTokensList();
	}, [getClaimedTokensList, fastRefresh])

	return (
		<TokenTapContext.Provider value={{tokensList, tokensListLoading, claimedTokensList}}>
			{children}
		</TokenTapContext.Provider>
	);
};

export default TokenTapProvider;