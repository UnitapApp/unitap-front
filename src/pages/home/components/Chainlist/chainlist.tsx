import React, { useContext, useEffect, useMemo, useState } from 'react';
import styled from 'styled-components/';
import { DV } from 'components/basic/designVariables';
import { ClaimButton, ClaimedButton, SecondaryButton } from 'components/basic/Button/button';
import { ClaimContext } from 'hooks/useChainList';
import { formatWeiBalance, numberWithCommas } from 'utils/numbers';
import { getChainIcon } from '../../../../utils';
import useSelectChain from '../../../../hooks/useSelectChain';
import { useWeb3React } from '@web3-react/core';
import { Chain, ChainType, ClaimReceipt, ClaimReceiptState, PK } from 'types';
import { useLocation, useNavigate } from 'react-router-dom';
import RoutePath from '../../../../routes';
import { UserProfileContext } from 'hooks/useUserProfile';
import { BigNumber } from '@ethersproject/bignumber';

// import { StaticJsonRpcProvider } from '@ethersproject/providers';
// import { useNativeCurrencyOnChain } from 'hooks/useNativeCurrency';
// import JSBI from 'jsbi';
// import { CurrencyAmount } from '@uniswap/sdk-core';

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
`;

const ChainList = () => {
	const { chainList, chainListSearchResult } = useContext(ClaimContext);

	const { isGasTapAvailable } = useContext(UserProfileContext);
	const [highlightedChain, setHighlightedChain] = useState('');

	const location = useLocation();

	const chainListMemo = useMemo(
		() =>
			chainListSearchResult.sort((a, b) => {
				const lowerHighlightChainName = highlightedChain.toLowerCase();

				if (a.chainName.toLowerCase() === lowerHighlightChainName) return -1;
				if (b.chainName.toLowerCase() === lowerHighlightChainName) return 1;

				return 0;
			}),
		[chainListSearchResult, highlightedChain],
	);

	useEffect(() => {
		const urlParams = new URLSearchParams(location.search);
		const highlightedChain = urlParams.get('highlightedChain');

		setHighlightedChain(highlightedChain || '');
	}, [location.search, setHighlightedChain]);

	return (
		<div className="chain-list-wrapper pt-5 pb-2 w-full mb-20">
			<div>
				{!chainList.length && (
					<div style={{ color: 'white', textAlign: 'center' }} data-testid="chain-list-loading">
						Loading...
					</div>
				)}

				{!chainList.length || !isGasTapAvailable ? (
					<>
						{!!chainListMemo.length && (
							<ChainCard
								isHighlighted={chainListMemo[0].chainName.toLowerCase() === highlightedChain.toLowerCase()}
								chain={chainListMemo[0]}
							/>
						)}

						{chainListMemo.slice(1).map((chain) => (
							<ChainCard chain={chain} key={chain.pk} />
						))}
					</>
				) : (
					<div className="text-white text-center mt-20" data-testid="chain-list-loading">
						Gas Tap is not available right now
					</div>
				)}
				{chainListSearchResult.length === 0 && chainList.length && <EmptyChainListCard />}
			</div>
		</div>
	);
};

const EmptyChainListCard = () => {
	return (
		<div className="empty-chain-list-card flex flex-col rounded-xl w-full overflow-hidden">
			<div className="empty-chain-list-card__top flex gap-4 flex-col sm:flex-row justify-between bg-gray20 pl-3 pr-6 py-4">
				<span className="empty-chain-list-card__info flex w-full items-center justify-center sm:justify-start gap-3">
					<span className="empty-chain-list-card__info__logo w-11 h-11 bg-gray30 rounded-full"></span>
					<p className="empty-chain-list-card__info__name text-white">Chain Not Found</p>
				</span>
				<span className="empty-chain-list-card__actions flex flex-col w-full items-center sm:justify-end sm:flex-row gap-2 sm:gap-4">
					<span className="empty-chain-list-card__actions__action w-24 h-11 bg-gray30 rounded-lg"></span>
					<span className="empty-chain-list-card__actions__action w-56 h-11 bg-gray30 rounded-lg"></span>
				</span>
			</div>
			<div className="empty-chain-list-card__bottom flex flex-col sm:flex-row justify-between items-center py-2.5 px-9 bg-gray30">
				<span className="flex justify-between w-full sm:justify-start">
					<p className="chain-card__info__title text-sm text-gray90">Currency</p>
					<p className="chain-card__info__value font-mono text-sm text-white ml-1.5">404</p>
				</span>
				<span className="flex justify-between w-full sm:justify-center">
					<p className="chain-card__info__title text-sm text-gray90">Claims This Round</p>
					<p className="chain-card__info__value font-mono text-sm text-white ml-1.5">404</p>
				</span>
				<span className="flex justify-between w-full sm:justify-end">
					<p className="chain-card__info__title text-sm text-gray90">Total Claims</p>
					<p className="chain-card__info__value font-mono text-sm text-white ml-1.5">404</p>
				</span>
			</div>
		</div>
	);
};

type ChainCardProps = {
	chain: Chain;
	isHighlighted?: boolean;
};

const ChainCard = ({ chain, isHighlighted }: ChainCardProps) => {
	const { openClaimModal } = useContext(ClaimContext);

	const addAndSwitchToChain = useSelectChain();
	const { account } = useWeb3React();
	const active = !!account;

	const navigate = useNavigate();

	const handleRefillButtonClicked = (chainId: PK) => {
		navigate(RoutePath.FUND + `?chainId=${chainId}`);
	};

	// const { provider } = useWeb3React();
	const [fundManagerBalance, setFundManagerBalance] = useState<BigNumber | null>(null);

	// useEffect(() => {
	//   new StaticJsonRpcProvider(chain.rpcUrl)?.getBalance(chain.fundManagerAddress).then((balance) => {
	//     setFundManagerBalance(balance);
	//   });
	// }, [chain, provider]);

	// const nativeCurrency = useNativeCurrencyOnChain(Number(chain.chainId));

	// const fundManagerBalanceAmount = useMemo(() => {
	//   if (!fundManagerBalance) return null;
	//   const amount = JSBI.BigInt(fundManagerBalance.toString());
	//   return CurrencyAmount.fromRawAmount(nativeCurrency, amount);
	// }, [nativeCurrency, fundManagerBalance]);

	const { activeClaimHistory } = useContext(ClaimContext);

	return (
		<div key={chain.chainId}>
			<div
				className={`chain-card ${
					isHighlighted ? 'before:!inset-[1.5px] p-0 gradient-outline-card mb-20' : 'mb-4'
				} rounded-xl flex flex-col items-center justify-center w-full`}
			>
				<div
					className={`pt-4 pr-6 pb-4 pl-3 w-full ${
						isHighlighted ? 'bg-g-primary-low' : 'bg-gray20'
					} flex flex-col sm:flex-row gap-2 sm:gap-0 justify-between items-center rounded-t-xl`}
				>
					<div
						onClick={() => window.open(chain.blockScanAddress, '_blank')}
						className="hover:cursor-pointer items-center flex mb-6 sm:mb-0"
					>
						<span className="chain-logo-container w-10 h-10 flex justify-center">
							<img className="chain-logo w-auto h-[100%]" src={getChainIcon(chain)} alt="polygon logo" />
						</span>
						<p className=" text-white ml-3 text-center sm:text-left" data-testid={`chain-name-${chain.pk}`}>
							{chain.chainName}
						</p>
						<img className="arrow-icon mt-1 ml-1.5 w-2 h-2" src="assets/images/arrow-icon.svg" alt="arrow" />
					</div>

					<div className={'flex items-center justify-end flex-col sm:flex-row gap-2 sm:gap-0 sm:w-auto'}>
						<div className="w-full sm:w-auto items-center sm:items-end">
							{chain.chainType === 'EVM' && (
								<AddMetamaskButton
									disabled={!active}
									data-testid={`chain-switch-${chain.pk}`}
									onClick={() => addAndSwitchToChain(chain)}
									className="font-medium hover:cursor-pointer mx-auto sm:mr-4 text-sm !w-[220px] sm:!w-auto"
								>
									<img
										src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/MetaMask_Fox.svg/800px-MetaMask_Fox.svg.png"
										alt="metamask logo"
									/>
									Add
								</AddMetamaskButton>
							)}
						</div>

						<div className="action flex flex-col md:flex-row w-full sm:w-auto items-center sm:items-end">
							{/* todo migrate buttom logic*/}
							{activeClaimHistory.find(
								(claim: ClaimReceipt) => claim.chain.pk === chain.pk && claim.status === ClaimReceiptState.VERIFIED,
							) ? (
								<ClaimedButton
									data-testid={`chain-claimed-${chain.pk}`}
									mlAuto
									icon="../assets/images/claim/claimedIcon.svg"
									iconWidth={24}
									iconHeight={20}
									onClick={() => openClaimModal(chain.pk)}
									className="text-sm bg-g-primary-low border-2 border-space-green m-auto"
								>
									<p className="text-gradient-primary flex-[2] font-semibold text-sm">Claimed!</p>
								</ClaimedButton>
							) : chain.needsFunding && chain.chainType !== ChainType.SOLANA ? (
								<div className="btn btn--claim btn--sm btn--out-of-balance">
									Out of balance
									<button onClick={() => handleRefillButtonClicked(chain.pk)} className="btn btn--sm btn--refill">
										Refill
									</button>
								</div>
							) : !activeClaimHistory.find(
									(claim: ClaimReceipt) => claim.chain.pk === chain.pk && claim.status !== ClaimReceiptState.REJECTED,
							  ) ? (
								<ClaimButton
									data-testid={`chain-show-claim-${chain.pk}`}
									mlAuto
									onClick={() => openClaimModal(chain.pk)}
									className="text-sm m-auto"
								>
									<p>{`Claim ${formatWeiBalance(chain.maxClaimAmount)} ${chain.symbol}`}</p>
								</ClaimButton>
							) : (
								<ClaimButton
									data-testid={`chain-show-claim-${chain.pk}`}
									mlAuto
									onClick={() => openClaimModal(chain.pk)}
									className="text-sm m-auto"
								>
									<p>Pending ...</p>
								</ClaimButton>
							)}
						</div>
					</div>
				</div>
				<div
					className={`${
						isHighlighted ? 'bg-g-primary-low' : 'bg-gray30'
					} w-full gap-2 md:gap-0 items-center flex flex-col md:flex-row rounded-b-xl px-8 py-2.5 justify-between`}
				>
					<div
						className={`${
							isHighlighted ? 'bg-transparent' : 'bg-gray30'
						} w-full items-center flex rounded-b-xl px-4 justify-between md:justify-start`}
					>
						<p className="chain-card__info__title text-sm text-gray90">Currency</p>
						<p className="chain-card__info__value font-mono text-sm text-white ml-1.5">{chain.symbol}</p>
						{/* <LightOutlinedButton className='donate-gas !p-1 !px-2 !text-xs !font-medium ml-4'>Provide gas</LightOutlinedButton> */}
					</div>
					<div
						className={`${
							isHighlighted ? 'bg-transparent' : 'bg-gray30'
						} w-full items-center flex rounded-b-xl px-4 justify-between md:justify-center`}
					>
						<p className="chain-card__info__title text-sm text-gray90">This Round Claims</p>
						<p className="chain-card__info__value font-mono text-sm text-white ml-1.5">
							{numberWithCommas(chain.totalClaimsSinceLastMonday)}
						</p>
					</div>
					<div
						className={`${
							isHighlighted ? 'bg-transparent' : 'bg-gray30'
						} w-full items-center flex rounded-b-xl px-4 justify-between md:justify-end`}
					>
						<p className="chain-card__info__title text-sm text-gray90">Total Claims</p>
						<p className="chain-card__info__value font-mono text-sm text-white ml-1.5">
							{numberWithCommas(chain.totalClaims)}
						</p>
					</div>
				</div>
			</div>
		</div>
	);
};

export default ChainList;
