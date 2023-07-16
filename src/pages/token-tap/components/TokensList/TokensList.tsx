import React, { useContext, useState, useMemo, useEffect } from 'react';
import Icon from 'components/basic/Icon/Icon';
import { TokenTapContext } from '../../../../hooks/token-tap/tokenTapContext';
import { useLocation } from 'react-router-dom';
import TokenCard from '../TokenCard';

const TokensList = () => {
	const { tokensList, tokensListLoading, tokenListSearchResult } = useContext(TokenTapContext);
	const windowSize = window.innerWidth;
	const [highlightedToken, setHighlightedToken] = useState('');

	const location = useLocation();

	const tokenListMemo = useMemo(
		() =>
			tokenListSearchResult.sort((a, b) => {
				const lowerHighlightChainName = highlightedToken.toLowerCase();

				if (a.name.toLowerCase() === lowerHighlightChainName) return -1;
				if (b.name.toLowerCase() === lowerHighlightChainName) return 1;

				return 0;
			}),
		[tokenListSearchResult, highlightedToken],
	);

	useEffect(() => {
		const urlParams = new URLSearchParams(location.search);
		const highlightedChain = urlParams.get('hc');

		setHighlightedToken(highlightedChain || '');
	}, [location.search, setHighlightedToken]);

	return (
		<div className="tokens-list-wrapper py-6 mb-20 w-full">
			{tokensListLoading && tokensList.length === 0 && (
				<div style={{ color: 'white', textAlign: 'center' }} data-testid="chain-list-loading">
					Loading...
				</div>
			)}
			{!!tokenListMemo.length && (
				<TokenCard
					isHighlighted={tokenListMemo[0].name.toLowerCase() === highlightedToken.toLowerCase()}
					token={tokenListMemo[0]}
				/>
			)}

			{tokenListMemo.slice(1).map((token) => (
				<TokenCard token={token} key={token.id} />
			))}

			{tokenListSearchResult.length === 0 && !!tokensList.length && (
				<Icon
					className="mb-4"
					iconSrc={
						windowSize > 992 ? 'assets/images/claim/empty-list.svg' : 'assets/images/claim/empty-list-mobile.svg'
					}
					width="100%"
				/>
			)}
			<FinalVersionCard />
		</div>
	);
};

const FinalVersionCard = () => {
	return (
		<div className="token-tap__final-version-container w-full h-60 bg-gray20 rounded-xl relative">
			<div className="token_tap__final-version-card flex flex-col items-center text-center min-w-[240px] sm:flex-row sm:w-max py-3 sm:py-2 px-3.5 gap-5 sm:gap-9 bg-gray50 border-2 border-gray60 rounded-lg absolute bottom-7 left-1/2 -translate-x-1/2"></div>
		</div>
	);
};

export default TokensList;
