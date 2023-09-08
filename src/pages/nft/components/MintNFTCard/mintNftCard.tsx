import { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { ClaimButton } from 'components/basic/Button/button';

import Icon from 'components/basic/Icon/Icon';
import { useUnitapPassMultiMintCallback } from '../../../../hooks/pass/useUnitapPassMultiMintCallback';
import { useUnitapBatchSale } from '../../../../hooks/pass/useUnitapBatchSale';
import JSBI from 'jsbi';
import { CurrencyAmount } from '@uniswap/sdk-core';
import useNativeCurrency from '../../../../hooks/useNativeCurrency';
import useSelectChain from 'hooks/useSelectChain';
import { useWeb3React } from '@web3-react/core';
import { SupportedChainId } from '../../../../constants/chains';
import { ClaimContext } from 'hooks/useChainList';
import { Chain, TransactionState } from 'types';
import useWalletActivation from 'hooks/useWalletActivation';
import { getUnitapPassChainId } from '../../../../utils/env';

const MintNFTCard = () => {
	const [count, setCount] = useState(1);
	const [transactionState, setTransactionState] = useState(TransactionState.IDLE);

	const { price, batchSoldCount, batchSize } = useUnitapBatchSale();
	const [accountBalance, setAccountBalance] = useState<number>(0);

	const remainingCount = useMemo(
		() => (batchSize ? batchSize - (batchSoldCount || 0) : undefined),
		[batchSize, batchSoldCount],
	);

	const { chainId, account, provider } = useWeb3React();

	useEffect(() => {
		if (!account || !provider) return;
		provider.getBalance(account).then((balance) => {
			setAccountBalance(Number(balance.toString()));
		});
	}, [account, provider]);

	const addAndSwitchToChain = useSelectChain();

	const isRightChain = useMemo(() => {
		if (!chainId) return false;
		return chainId === getUnitapPassChainId();
	}, [chainId]);

	const nativeCurrency = useNativeCurrency();

	const priceAmount = useMemo(() => {
		if (!price) return undefined;
		const amount = JSBI.BigInt(price.toString());
		return CurrencyAmount.fromRawAmount(nativeCurrency, amount);
	}, [nativeCurrency, price]);

	const totalPriceAmount = useMemo(() => {
		if (!priceAmount) return undefined;
		return priceAmount.multiply(count);
	}, [count, priceAmount]);

	const { callback: mintPassCallback } = useUnitapPassMultiMintCallback(count);
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const [submittedTxHash, setSubmittedTxHash] = useState<string | null>(null);

	const [loading, setLoading] = useState(false);
	const mounted = useRef(false);

	const { tryActivation } = useWalletActivation();

	const { chainList } = useContext(ClaimContext);

	const chainScanLink = useMemo(() => {
		if (submittedTxHash) {
			if (chainId === SupportedChainId.MAINNET) {
				return `https://etherscan.io/tx/${submittedTxHash}`;
			} else if (chainId === SupportedChainId.GOERLI) {
				return `https://goerli.etherscan.io/tx/${submittedTxHash}`;
			}
		}
	}, [chainId, submittedTxHash]);

	const switchNetwork = () => {
		const goerliChain = chainList.find((chain) => chain.chainId === SupportedChainId.GOERLI.toString());
		const mainnetChain: Chain = {
			pk: 123456789,
			chainName: 'Ethereum Mainnet',
			nativeCurrencyName: 'Ether',
			symbol: 'ETH',
			chainId: '1',
			logoUrl: 'https://assets.coingecko.com/coins/images/279/large/ethereum.png?1595348880',
			modalUrl: 'https://assets.coingecko.com/coins/images/279/large/ethereum.png?1595348880',
			explorerUrl: 'https://etherscan.io',
			rpcUrl: 'https://mainnet.infura.io/v3/6b8c2c5b3f3a4f1e9e7d3e7b2ce9f2d4',
			maxClaimAmount: 0,
			claimed: 'N/A',
			unclaimed: 'N/A',
			decimals: 18,
			fundManagerAddress: '0x0000000000000000000000000000000000000000',
			totalClaims: 0,
			gasImageUrl: 'https://assets.coingecko.com/coins/images/279/large/ethereum.png?1595348880',
			totalClaimsSinceLastMonday: 0,
			isTestnet: false,
			chainType: 'Ethereum',
			needsFunding: false,
			blockScanAddress: 'https://etherscan.io/address/',
		};

		if (getUnitapPassChainId() === SupportedChainId.MAINNET && mainnetChain) {
			addAndSwitchToChain(mainnetChain);
		} else if (getUnitapPassChainId() === SupportedChainId.GOERLI && goerliChain) {
			addAndSwitchToChain(goerliChain);
		}

		return;
	};

	useEffect(() => {
		mounted.current = true;
		return () => {
			mounted.current = false;
		};
	}, []);

	let sufficientAmount = useMemo(() => {
		if (getUnitapPassChainId() === SupportedChainId.MAINNET) {
			return 100000000000000000 * count <= accountBalance;
		} else if (getUnitapPassChainId() === SupportedChainId.GOERLI) {
			return 1000000000000000 * count <= accountBalance;
		}
		return false;
	}, [count, accountBalance]);

	const mintPass = useCallback(async () => {
		if (loading) return;
		setLoading(true);
		try {
			const tx = await mintPassCallback?.();
			if (tx) {
				setSubmittedTxHash(tx.hash);
				setTransactionState(TransactionState.PENDING);
				tx.wait()
					.then(() => {
						if (mounted.current) {
							setTransactionState(TransactionState.ACCEPTED);
							// console.log(res);
							// setOpenseaLink(``);
						}
					})
					.catch(() => {
						if (mounted.current) {
							setTransactionState(TransactionState.FAILED);
						}
					});
			}
		} catch (e) {
			console.log('mint failed');
			console.log(e);
		}
		if (mounted.current) {
			setLoading(false);
		}
	}, [loading, mintPassCallback]);

	return (
		<div className="mint-nft-card h-full flex flex-col justify-between ">
			{transactionState !== TransactionState.IDLE ? (
				<div className="mint-nft-card__success p-4 h-full flex flex-col justify-between">
					<p className="text-gradient-primary mx-auto font-bold text-sm">UNITAP PASS</p>
					<div className="mint-nft-card__nft__image w-full my-6 flex justify-center">
						<div className="mint-nft-card__nft__image__wrapper w-full h-auto">
							<div className="w-full h-full overflow-hidden rounded-lg">
								<video
									src="assets/videos/unitap-pass.mp4"
									autoPlay
									muted
									loop
									className="w-full object-cover"
									poster="assets/images/nft/nft-poster.jpg"
								></video>
							</div>
						</div>
					</div>
					{transactionState === TransactionState.ACCEPTED ? (
						<>
							<p className="text-space-green mx-auto font-bold text-sm mb-3">
								{count} Unitap Pass{count > 1 ? 'es' : ''} Minted Successfully
							</p>
							<p
								onClick={() => window.open(chainScanLink, '_blank')}
								className="text-white mx-auto font-medium text-sm mb-6 hover:underline cursor-pointer"
							>
								See on {getUnitapPassChainId() === SupportedChainId.MAINNET ? 'Etherscan' : 'Goerli Etherscan'}
							</p>
						</>
					) : transactionState === TransactionState.PENDING ? (
						<p className="text-gradient-primary mx-auto font-medium text-sm mb-3">
							Minting {count} Unitap Pass{count > 1 ? 'es' : ''}!
						</p>
					) : (
						<p className="text-rose-800 mx-auto font-medium text-sm mb-3">Minting Failed!</p>
					)}
					{transactionState === TransactionState.ACCEPTED || transactionState === TransactionState.FAILED ? (
						<ClaimButton
							onClick={() => setTransactionState(TransactionState.IDLE)}
							height="48px"
							width="100% !important"
						>
							<p>Done</p>
						</ClaimButton>
					) : (
						<ClaimButton height="48px" width="100% !important" disabled>
							<p>Pending</p>
						</ClaimButton>
					)}
				</div>
			) : (
				<>
					<div className="mint-nft-card__nft p-2 h-full flex flex-col justify-between">
						<div className="mint-nft-card__nft__info text-xs font-medium flex items-center w-full justify-between">
							<p className="text-gray100 bg-gray10 px-3 py-2 rounded-lg text-xs flex gap-1">
								Network:
								<span className="text-white flex">
									{' '}
									ETH <img className={'w-2.5 h-auto ml-2'} src={'assets/images/nft/eth-icon.svg'} alt={''} />{' '}
								</span>
							</p>
							<p className="text-gray100">
								<span className="text-white"> {remainingCount === undefined ? '...' : remainingCount} </span> of
								<span className="text-white"> {batchSize === undefined ? '...' : batchSize} </span>
								Left in current batch
							</p>
						</div>
						<div className="mint-nft-card__nft__image w-full my-5 flex justify-center">
							<div className="mint-nft-card__nft__image__wrapper w-[312px] h-auto">
								<div className="w-full h-full overflow-hidden rounded-lg">
									<video
										src="assets/videos/unitap-pass.mp4"
										autoPlay
										muted
										loop
										className="w-full object-cover"
									></video>
								</div>
							</div>
						</div>
						<div className="mint-nft-card__nft__price text-sm font-semibold flex w-full justify-between mt-auto">
							<p className="text-white">{count > 1 && 'Total'} Price:</p>
							<p className="text-gray100 flex gap-x-1.5">
								{count > 1 && isRightChain && (
									<p>
										{count} x {priceAmount?.toSignificant(5) || '0'} ETH ={' '}
									</p>
								)}
								<span className="text-white">
									{totalPriceAmount === undefined ? '...' : totalPriceAmount?.toSignificant(5) || '0'} ETH
								</span>
							</p>
						</div>
					</div>
					<div className="mint-nft-card__actions bg-gray30 w-full flex-col lg:flex-row flex gap-2 justify-between items-center py-3 px-4">
						{isRightChain && remainingCount && remainingCount > 0 && (
							<div className="mint-nft-card__actions__quantity w-full lg:w-auto flex items-center">
								<div
									className={`text-white border-2 border-gray60 flex-1 h-12 min-w-[48px] flex justify-center py-3 items-center rounded-l-xl ${
										count === 1 ? 'cursor-default' : 'cursor-pointer hover:bg-primaryGradient'
									}`}
									onClick={() => (count !== 1 ? setCount(count - 1) : null)}
								>
									{count === 1 ? (
										<Icon iconSrc="assets/images/nft/nft-minus-gray.svg" />
									) : (
										<Icon iconSrc="assets/images/nft/nft-minus-white.svg" />
									)}
								</div>
								<div
									className={`text-white border-y-2 border-gray60  py-3 flex-1 h-12 min-w-[48px] flex items-center justify-center font-bold cursor-default`}
								>
									{count}
								</div>
								<div
									className={`text-white border-2 border-gray60 flex-1 h-12 min-w-[48px] flex justify-center py-3 items-center rounded-r-xl ${
										count === remainingCount ? 'cursor-default' : 'cursor-pointer hover:bg-primaryGradient'
									}`}
									onClick={() => (count !== remainingCount ? setCount(count + 1) : null)}
								>
									{count === remainingCount ? (
										<Icon iconSrc="assets/images/nft/nft-plus-gray.svg" />
									) : (
										<Icon iconSrc="assets/images/nft/nft-plus-white.svg" />
									)}
								</div>
							</div>
						)}
						{!account ? (
							<ClaimButton onClick={tryActivation} height="48px" width="100% !important">
								<p>Connect Wallet</p>
							</ClaimButton>
						) : isRightChain ? (
							remainingCount ? (
								!sufficientAmount ? (
									<ClaimButton height="48px" width="100% !important" disabled>
										<p>Insufficient ETH Amount</p>
									</ClaimButton>
								) : (
									<ClaimButton onClick={mintPass} height="48px" width="100% !important">
										<p>Mint Unitap Pass</p>
									</ClaimButton>
								)
							) : (
								<ClaimButton height="48px" width="100% !important" disabled>
									<p>Sold Out</p>
								</ClaimButton>
							)
						) : (
							<ClaimButton onClick={switchNetwork} height="48px" width="100% !important">
								<p>Switch Network</p>
							</ClaimButton>
						)}
					</div>
				</>
			)}
		</div>
	);
};

export default MintNFTCard;
