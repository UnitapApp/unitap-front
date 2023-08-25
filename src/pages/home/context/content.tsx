import { FC, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { ClaimButton } from 'components/basic/Button/button';
import Icon from 'components/basic/Icon/Icon';
import { ClaimContext } from 'hooks/useChainList';
import { Chain, ChainType } from 'types';
import { parseEther } from '@ethersproject/units';
import Modal from 'components/common/Modal/modal';
import { getChainIcon } from 'utils';
import { calculateGasMargin, USER_DENIED_REQUEST_ERROR_CODE } from 'utils/web3';
import useWalletActivation from 'hooks/useWalletActivation';
import useSelectChain from 'hooks/useSelectChain';
import { useWeb3React } from '@web3-react/core';
import { fromWei, parseToLamports } from 'utils/numbers';
import FundTransactionModal from 'pages/fund/components/FundTransactionModal/FundTransactionModal';
import SelectChainModal from 'pages/fund/components/SelectChainModal/selectChainModal';

const Content: FC<{ initialChainId?: number }> = ({ initialChainId }) => {
	const { chainList: originalChainList } = useContext(ClaimContext);
	const { chainId, provider, account } = useWeb3React();
	const active = !!account;
	const { tryActivation } = useWalletActivation();

	const [selectedChain, setSelectedChain] = useState<Chain | null>(null);
	const [balance, setBalance] = useState<string | number>('');

	const chainList = useMemo(() => {
		return originalChainList.filter((chain) => chain.chainType !== ChainType.SOLANA);
	}, [originalChainList]);

	useEffect(() => {
		if (chainList.length > 0 && !selectedChain) {
			if (initialChainId) {
				const chain = chainList.find((chain) => chain.pk === Number(initialChainId));
				if (chain) {
					setSelectedChain(chain);
				}
			} else {
				setSelectedChain(chainList[0]);
			}
		}
	}, [chainList, initialChainId, selectedChain]);

	const addAndSwitchToChain = useSelectChain();

	const [fundAmount, setFundAmount] = useState<string>('');

	const [modalState, setModalState] = useState(false);
	const [fundTransactionError, setFundTransactionError] = useState('');
	const [txHash, setTxHash] = useState('');
	const isRightChain = useMemo(() => {
		if (!active || !chainId || !selectedChain) return false;
		return chainId === Number(selectedChain.chainId);
	}, [selectedChain, active, chainId]);

	const handleTransactionError = useCallback((error: any) => {
		if (error?.code === USER_DENIED_REQUEST_ERROR_CODE) return;
		const message = error?.data?.message || error?.error?.message;
		if (message) {
			if (message.includes('insufficient funds')) {
				setFundTransactionError('Error: Insufficient Funds');
			} else {
				setFundTransactionError(message);
			}
		} else {
			setFundTransactionError('Unexpected error. Could not estimate gas for this transaction.');
		}
	}, []);

	const [submittingFundTransaction, setSubmittingFundTransaction] = useState(false);

	const loading = useMemo(() => {
		if (submittingFundTransaction) return true;
		if (!active) return false;
		return !chainId || !selectedChain || !account;
	}, [account, active, chainId, selectedChain, submittingFundTransaction]);

	const handleSendFunds = useCallback(async () => {
		if (!active) {
			await tryActivation();
			return;
		}
		if (!chainId || !selectedChain || !account || loading) return;
		if (!isRightChain) {
			await addAndSwitchToChain(selectedChain);
			return;
		}
		if (!Number(fundAmount)) {
			alert('Enter fund amount');
			return;
		}

		if (!provider) return;
		let tx = {
			from: account,
			to: selectedChain.fundManagerAddress,
			value: selectedChain.symbol === 'SOL' ? parseToLamports(fundAmount) : parseEther(fundAmount),
		};

		setSubmittingFundTransaction(true);

		const estimatedGas = await provider.estimateGas(tx).catch((err: any) => {
			return err;
		});

		if ('error' in estimatedGas || 'code' in estimatedGas) {
			handleTransactionError(estimatedGas);
			setSubmittingFundTransaction(false);
			return;
		}

		provider
			.getSigner()
			.sendTransaction({
				...tx,
				...(estimatedGas ? { gasLimit: calculateGasMargin(estimatedGas) } : {}),
				// gasPrice /// TODO add gasPrice based on EIP 1559
			})
			.then(async (tx) => {
				await tx.wait(1);
				return tx;
			})
			.then((tx) => {
				setTxHash(tx.hash);
			})
			.catch((err) => {
				handleTransactionError(err);
			})
			.finally(() => {
				setSubmittingFundTransaction(false);
			});
	}, [
		active,
		chainId,
		selectedChain,
		account,
		loading,
		isRightChain,
		fundAmount,
		provider,
		tryActivation,
		addAndSwitchToChain,
		handleTransactionError,
	]);

	const closeModalHandler = () => {
		setFundTransactionError('');
		setTxHash('');
		setModalState(false);
	};

	const fundActionButtonLabel = useMemo(() => {
		if (!active) {
			return 'Connect Wallet';
		}
		if (loading) {
			return 'Loading...';
		}
		return !isRightChain ? 'Switch Network' : 'Submit Contribution';
	}, [active, isRightChain, loading]);

	useEffect(() => {
		if (!isRightChain || !account) {
			setBalance('');
			return;
		}

		provider?.getBalance(account).then((res) => {
			setBalance(fromWei(res.toString()).slice(0, 6));
		});
	}, [isRightChain, account, provider]);

	return (
		<div className="flex justify-center">
			<Modal titleLeft="Select Chain" isOpen={modalState} size="medium" closeModalHandler={closeModalHandler}>
				<SelectChainModal
					closeModalHandler={closeModalHandler}
					selectedChain={selectedChain}
					setSelectedChain={setSelectedChain}
				></SelectChainModal>
			</Modal>
			<div className="rounded-xl py-6 px-4 z-0">
				<img
					alt="gas fee planet"
					src="./assets/images/fund/provide-gas-fee-planet.svg"
					className="absolute -left-64 -top-16 scale-150 -z-10"
				/>
				<span className="z-100 w-full">
					<Icon
						className="mb-2"
						iconSrc="./assets/images/fund/provide-gas-fee-battery.svg"
						width="146px"
						height="auto"
						alt="gas fee battery"
					/>
					<p className="text-white font-bold text-xl mb-3 z-1">Provide Gas Fee</p>
					<p className="text-gray100 text-xs mb-3 z-1">
						100% of contributions will fund distributions and transaction costs of the gas tap.
					</p>

					<div className="select-box w-full flex rounded-xl overflow-hidden mt-5 mb-2 bg-gray40">
						<div
							className="select-box__token flex justify-evenly items-center w-24 h-16 cursor-pointer transition-all duration-50 bg-gray30 hover:bg-gray60"
							onClick={() => setModalState(true)}
						>
							{selectedChain ? (
								<Icon alt={selectedChain.chainName} iconSrc={getChainIcon(selectedChain)} width="auto" height="32px" />
							) : (
								<span className="w-8 h-8 rounded-full bg-gray50"></span>
							)}
							<Icon iconSrc="assets/images/fund/arrow-down.png" width="14px" height="auto" />
						</div>
						<div className="select-box__info w-full flex flex-col justify-between my-2 ml-3 mr-4 bg-gray40">
							<div className="select-box__info__top w-full flex items-center justify-between">
								<p className="select-box__info__coin-symbol text-white text-xs font-semibold">
									{selectedChain?.symbol}
								</p>
								{!!balance && (
									<p
										onClick={() => setFundAmount(balance.toString())}
										className="select-box__info__coin-balance text-gray100 text-xs cursor-pointer hover:text-primary-light font-semibold"
									>
										Balance: {balance + ' ' + selectedChain?.symbol}{' '}
									</p>
								)}
							</div>
							<div className="select-box__info__amount w-full">
								<input
									className="fund-input w-full text-xl bg-transparent text-white"
									type="number"
									step="0.001"
									min="0"
									autoFocus={true}
									placeholder="Enter Amount"
									value={fundAmount}
									onChange={(e) => setFundAmount(e.target.value)}
								/>
							</div>
						</div>
					</div>

					<ClaimButton
						height="3.5rem"
						className="!w-full mt-5"
						fontSize="20px"
						onClick={handleSendFunds}
						disabled={!Number(fundAmount) && isRightChain && active}
						data-testid="fund-action"
					>
						{fundActionButtonLabel}
					</ClaimButton>
					<Modal isOpen={!!fundTransactionError || !!txHash} closeModalHandler={closeModalHandler}>
						<FundTransactionModal
							fundAmount={fundAmount}
							closeModalHandler={closeModalHandler}
							provideGasFeeError={fundTransactionError}
							txHash={txHash}
							selectedChain={selectedChain}
						/>
					</Modal>
				</span>
			</div>
		</div>
	);
};

export default Content;
