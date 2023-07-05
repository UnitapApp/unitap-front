import React, { FC, useContext, useState, useMemo, useEffect } from 'react';
import styled from 'styled-components/';
import { DV } from 'components/basic/designVariables';
import { ClaimButton, ClaimedButton, NoCurrencyButton, SecondaryButton } from 'components/basic/Button/button';
import { numberWithCommas } from 'utils/numbers';
import Icon from 'components/basic/Icon/Icon';
import { getChainIcon } from 'utils';
import { Token } from 'types';
import { TokenTapContext } from '../../../../hooks/token-tap/tokenTapContext';
import Markdown from '../Markdown';
import { useLocation } from 'react-router-dom';
import { useWeb3React } from '@web3-react/core';

const Action = styled.div`
	display: flex;

	@media only screen and (max-width: ${DV.breakpoints.smallDesktop}) {
		flex-direction: column;
	}
`;

const AddMetamaskButton = styled(SecondaryButton)`
	display: flex;
	flex-direction: row;
	align-items: center;
	color: white;
	background-color: #21212c;
	border: 2px solid #1b1b26;
	gap: ${DV.sizes.baseMargin * 1.5}px;
	font-weight: 500;

	img {
		width: 20px;
		height: 20px;
		transform: scale(1.4);
	}

	&:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}
`;

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

const TokenCard: FC<{ token: Token; isHighlighted?: boolean }> = ({ token, isHighlighted }) => {
	const { openClaimModal, claimedTokensList, claimTokenSignatureLoading } = useContext(TokenTapContext);

	const { account, provider } = useWeb3React();

	const active = !!account;

	const onTokenClicked = () => {
		window.open(token.distributorUrl);
	};

	const addToken = async () => {
		if (!window.ethereum) return;

		console.log({
			chainId: token.chain.chainId,
			address: token.tokenAddress,
			name: token.name,
			symbol: token.chain.symbol,
			decimals: 18,
			logoURI: token.imageUrl,
		});

		const tokenAddress = '0xd00981105e61274c8a5cd5a88fe7e037d935b513';
		const tokenSymbol = 'TUT';
		const tokenDecimals = 18;
		const tokenImage = 'http://placekitten.com/200/300';

		try {
			// wasAdded is a boolean. Like any RPC method, an error may be thrown.
			const wasAdded = await (window.ethereum as any).request({
				method: 'wallet_watchAsset',
				params: {
					type: 'ERC20', // Initially only supports ERC20, but eventually more!
					options: {
						address: tokenAddress, // The address that the token is at.
						symbol: tokenSymbol, // A ticker symbol or shorthand, up to 5 chars.
						decimals: tokenDecimals, // The number of decimals in the token
						image: tokenImage, // A string url of the token logo
					},
				},
			});

			if (wasAdded) {
				console.log('Thanks for your interest!');
			} else {
				console.log('Your loss!');
			}
		} catch (error) {
			console.log(error);
		}
	};

	const collectedToken = useMemo(
		() => claimedTokensList.find((item) => item.tokenDistribution.id === token.id),
		[claimedTokensList, token],
	);

	return (
		<div key={token.id}>
			<div
				className={`token-card flex ${
					isHighlighted ? 'before:!inset-[3px] p-0 gradient-outline-card mb-20' : 'mb-4'
				} flex-col items-center justify-center w-full mb-4`}
			>
				<span className="flex flex-col w-full">
					<div
						className={`pt-4 pr-6 pb-4 pl-3 ${
							isHighlighted ? 'bg-g-primary-low' : 'bg-gray40'
						} w-full flex flex-col md:flex-row gap-2 md:gap-0 justify-between items-center rounded-t-xl`}
					>
						<div onClick={onTokenClicked} className="hover:cursor-pointer items-center flex mb-6 sm:mb-0">
							<span className="chain-logo-container w-11 h-11 flex justify-center mr-3">
								<img className="chain-logo w-auto h-full" src={token.imageUrl} alt="chain logo" />
							</span>
							<span className="w-max">
								<p className="text-white text-center md:text-left flex mb-2" data-testid={`chain-name-${token.id}`}>
									{token.name}
									<img className="arrow-icon mt-1 ml-1 w-2" src="assets/images/arrow-icon.svg" alt="arrow" />
								</p>
								<p className="text-xs text-white font-medium">{token.distributor}</p>
							</span>
						</div>

						<div className={'flex items-center justify-end flex-col md:flex-row !w-full sm:w-auto'}>
							{/* <div className="w-full sm:w-auto items-center sm:items-end">
								<AddMetamaskButton
									disabled={!active}
									onClick={addToken}
									className="font-medium hover:cursor-pointer mx-auto sm:mr-4 text-sm !w-[220px] sm:!w-auto"
								>
									<img
										src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/MetaMask_Fox.svg/800px-MetaMask_Fox.svg.png"
										alt="metamask logo"
									/>
									Add
								</AddMetamaskButton>
							</div> */}
							<Action className={'w-full sm:w-auto items-center sm:items-end '}>
								{/* todo migrate buttom logic*/}
								{token.isMaxedOut ? (
									<NoCurrencyButton disabled fontSize="13px">
										Empty
									</NoCurrencyButton>
								) : collectedToken ? (
									claimTokenSignatureLoading ||
									(token.chain.chainName === 'Lightning' && collectedToken.status === 'Pending') ? (
										<ClaimButton
											data-testid={`chain-pending-claim-${token.id}`}
											mlAuto
											onClick={() => openClaimModal(token)}
											className="text-sm m-auto"
										>
											<p>{`Pending...`}</p>
										</ClaimButton>
									) : collectedToken!.status === 'Pending' ? (
										<ClaimButton
											data-testid={`chain-show-claim-${token.id}`}
											mlAuto
											onClick={() => openClaimModal(token)}
											className="text-sm m-auto"
										>
											<p>{`Claim ${token.amount} ${token.token}`}</p>
										</ClaimButton>
									) : (
										<ClaimedButton
											data-testid={`chain-claimed-${token.id}`}
											mlAuto
											icon="../assets/images/landing/tokentap-icon.png"
											iconWidth={24}
											iconHeight={20}
											onClick={() => openClaimModal(token)}
											className="text-sm bg-g-primary-low border-2 border-space-green m-auto"
										>
											<p className="text-gradient-primary flex-[2] font-semibold text-sm">Claimed!</p>
										</ClaimedButton>
									)
								) : token.amount !== 0 ? (
									<ClaimButton
										data-testid={`chain-show-claim-${token.id}`}
										mlAuto
										onClick={() => openClaimModal(token)}
										className="text-sm m-auto"
									>
										<p>{`Claim ${token.amount} ${token.token}`}</p>
									</ClaimButton>
								) : (
									<ClaimedButton
										data-testid={`chain-claimed-${token.id}`}
										mlAuto
										icon="../assets/images/claim/claimedIcon.svg"
										iconWidth={24}
										iconHeight={20}
										onClick={() => openClaimModal(token)}
										className="text-sm bg-dark-space-green border-2 border-space-green m-auto"
									>
										<p className="text-space-green flex-[2] font-medium text-sm">Claimed!</p>
									</ClaimedButton>
								)}
							</Action>
						</div>
					</div>
					<Markdown isHighlighted={isHighlighted} content={token.notes} />
				</span>
				<div
					className={`${
						isHighlighted ? 'bg-g-primary-low' : 'bg-gray30'
					} w-full gap-4 md:gap-0 items-center flex flex-col md:flex-row rounded-b-xl px-4 py-2.5 pr-6 justify-between`}
				>
					<div className="flex gap-x-2 items-center text-xs sm:text-sm">
						<p className="text-gray100">
							<span className="text-white">{numberWithCommas(token.maxNumberOfClaims - token.numberOfClaims)} </span> of{' '}
							<span className="text-white"> {numberWithCommas(token.maxNumberOfClaims)} </span> are left to claim on
							{' ' + token.chain.chainName}
						</p>
						<Icon iconSrc={getChainIcon(token.chain)} width="auto" height="16px" />
					</div>

					<div className="flex gap-x-6 items-center">
						<a target="_blank" rel="noreferrer" href={token.twitterUrl}>
							<Icon
								className="cursor-pointer"
								iconSrc="assets/images/token-tap/twitter-icon.svg"
								width="auto"
								height="20px"
							/>
						</a>
						<a target="_blank" rel="noreferrer" href={token.discordUrl}>
							<Icon
								className="cursor-pointer"
								iconSrc="assets/images/token-tap/discord-icon.svg"
								width="auto"
								height="20px"
							/>
						</a>
					</div>
				</div>
			</div>
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
