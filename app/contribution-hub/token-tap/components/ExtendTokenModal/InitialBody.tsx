'use client'
import { UserTokenDistribution, EnrollmentDurationsProps } from "@/types"
import { useWalletAccount, useWalletNetwork, useWalletProvider, useWalletSigner } from "@/utils/wallet"
import { useEffect, useState } from "react"
import { extendDistribution } from "@/components/containers/provider-dashboard/helpers/extendDistribution"
import { enrollmentDurationsInit } from "@/constants/contributionHub";
import EndDateComp from "./EndDateComp"
import { readContract } from "wagmi/actions"
import { tokenTapAbi } from "@/types/abis/contracts"
import { contractAddresses } from "@/constants"
import { config } from "@/utils/wallet/wagmi";
import { withdrawRemainingTokens } from "@/components/containers/provider-dashboard/helpers/withdrawRemainingTokens"
import { isAddress, zeroAddress } from "viem"
import DisplaySelectedDate from "./DisplaySelectedDate"
import { fromWei, toWei } from "@/utils/numbersBigNumber";
import Big from "big.js"
import { checkErc20Approve } from "@/components/containers/provider-dashboard/helpers/checkErc20Approve"
import { getBalance } from '@wagmi/core'
import { approveErc20 } from "@/components/containers/provider-dashboard/helpers/approveErc20"
import { extendedDistributeTokenApi } from "@/utils/api"

const InitialBody = ({ distribute }: { distribute: UserTokenDistribution }) => {
	const { address } = useWalletAccount();
	const { chain: activatedChain } = useWalletNetwork();
	const signer = useWalletSigner();
	const provider = useWalletProvider();
	const [txLoading, setTxLoading] = useState(false);
	const [refundRes, setRefundRes] = useState<any | null>(null);
	const chainId = activatedChain?.id;
	const [currentMaxNumClaims, setCurrentMaxNumClaims] = useState(distribute.maxNumberOfClaims);
	const [currentEndTime, setCurrentEndTime] = useState(Date.parse(distribute.deadline) / 1000);
	const distributionId = distribute.distributionId;
	const [extendOrWithdraw, setExtendWithdraw] = useState<string>('extend');
	const [enrollmentDurations, setEnrollmentDurations] = useState<EnrollmentDurationsProps[]>(enrollmentDurationsInit);
	const [isRefunded, setIsRefunded] = useState<boolean | null>(null);
	const [withdrawWalletAddress, setWithdrawWalletAddress] = useState<string | null>(null);
	const [errorMessage, setErrorMessage] = useState<string | null>(null);
	const [extendErrorMessage, setExtendErrorMessage] = useState<string | null>(null);
	const [updatedNumberOfClaims, setUpdatedNumberOfClaims] = useState<number>(0);
	const [updateEndDateTime, setUpdatedEndTime] = useState<number | null>(null);
	const [extraPayment, setExtraPayment] = useState<string>('0');
	const [approveAllowance, setApproveAllowance] = useState<string | null>(null);
	const [isApproved, setIsApproved] = useState<boolean | 'Empty'>('Empty')
	const [userBalance, setUserBalance] = useState<string | null>(null);
	const spenderAddress = contractAddresses.tokenTap[distribute.chain.chainId].erc20
	const isFinished = new Date(distribute.deadline) < new Date();
	const claimsLeft = currentMaxNumClaims - distribute.numberOfOnchainClaims;
	const isRejected = distribute.status === "REJECTED"
	const [insufficient, setInsufficient] = useState<boolean>(false)
	const isExtendBtnDisabled = insufficient || txLoading || !updateEndDateTime && !updatedNumberOfClaims || !!isRefunded || isRejected
	const isApproveBtnDisabled = insufficient || txLoading || !!isRefunded || isRejected
	const handleSetEnrollDuration = (id: number) => {
		setEnrollmentDurations(
			enrollmentDurations.map((item) =>
				item.id == id
					? { ...item, selected: true }
					: { ...item, selected: false },
			),
		);
	};

	const handelExtendToken = async () => {
		setExtendErrorMessage(null)
		const distributionId = distribute.distributionId;
		if (claimsLeft == 0 && updatedNumberOfClaims == 0) {
			setExtendErrorMessage('0 claims left');
			return
		}
		if (isRefunded) {
			setExtendErrorMessage('Refunded');
			return
		}
		const newEndTime = updateEndDateTime ? updateEndDateTime : Date.parse(distribute.deadline) / 1000;
		const maxNumberOfClaims = updatedNumberOfClaims ? updatedNumberOfClaims + currentMaxNumClaims : currentMaxNumClaims;
		const amount = distribute.tokenAddress === zeroAddress && updatedNumberOfClaims ? toWei(extraPayment) : 0
		if (!provider || !signer || !address || !chainId || !distributionId || !newEndTime) return
		if (Date.now() > Number(newEndTime) * 1000 || Number(newEndTime) < Date.parse(distribute.deadline) / 1000) {
			setExtendErrorMessage('Invalid time entry. The new time must be later than both the current time and the previously entered time. Please enter a valid time')
			return
		}
		setTxLoading(true);
		try {
			await extendDistribution(provider, signer, address, chainId, distributionId, setRefundRes, BigInt(maxNumberOfClaims), BigInt(newEndTime), BigInt(amount));
			await extendedDistributeTokenApi(distribute.id)
		}
		finally {
			setTxLoading(false);
			getDistributeStatus()
		}
	}

	const getDistributeStatus = async () => {
		if (!distribute) return;
		const data = await readContract(config, {
			abi: tokenTapAbi,
			address: contractAddresses.tokenTap[distribute.chain.chainId]
				?.erc20,
			functionName: "distributions",
			args: [BigInt(distribute.distributionId!)],
			chainId: Number(distribute?.chain.chainId),
		})
		setIsRefunded(data[7])
		setCurrentMaxNumClaims(Number(data[2]))
		setCurrentEndTime(Number(data[6]))
	}

	const handelWithdrawRemainingTokens = async () => {
		if (!withdrawWalletAddress || !isAddress(withdrawWalletAddress)) {
			setErrorMessage('Invalid wallet address')
			return
		}
		else {
			setErrorMessage(null)
		}
		if (!provider || !signer || !address || !chainId || !distributionId || !distribute || isRefunded) return
		try {
			setTxLoading(true);
			await withdrawRemainingTokens(provider, signer, address, chainId, distributionId, setRefundRes, withdrawWalletAddress);
		}
		finally {
			setTxLoading(false);
			getDistributeStatus()
		}
	}

	const handelCheckApproval = async () => {
		if (!provider || !address || isRefunded) return
		await checkErc20Approve(address, provider, distribute.tokenAddress, setApproveAllowance, spenderAddress, setUserBalance)
	}

	const handleApprove = async () => {
		if (!provider || !address || !signer) return;
		try {
			setTxLoading(true)
			await approveErc20(provider, signer, address, distribute.tokenAddress, setIsApproved, setApproveAllowance, spenderAddress, BigInt(toWei(extraPayment, distribute.decimals)))
		}
		finally {
			setTxLoading(false)
		}
	}

	const isWithdrawBtnDisabled = txLoading || !!isRefunded || !withdrawWalletAddress

	const userWalletBalance = async () => {
		if (!address) return
		const balance = await getBalance(config, {
			address,
			chainId: Number(distribute.chain?.chainId),
		});
		setUserBalance(balance.formatted)
	}

	useEffect(() => {
		if (isRejected) setExtendWithdraw('withdraw')
		getDistributeStatus()
		if (distribute.tokenAddress !== zeroAddress) {
			handelCheckApproval()
		}
		else {
			userWalletBalance()
		}
	}, [])

	useEffect(() => {
		if (!updatedNumberOfClaims) {
			setIsApproved('Empty');
			setExtraPayment('0')
			setInsufficient(false)
			return
		};
		const extraPayment = fromWei(Number(distribute.amount) * updatedNumberOfClaims, distribute.decimals)
		setExtraPayment(new Big(extraPayment).toFixed().toString())
		setIsApproved(extraPayment <= approveAllowance!)
		setInsufficient(Number(userBalance!) < Number(new Big(extraPayment).toFixed().toString()))
	}, [updatedNumberOfClaims])

	return (
		<div className="min-h-[480px] relative">
			<div className="rounded-xl flex w-full justify-between overflow-hidden border border-gray50 h-[44px] items-center cursor-pointer font-semibold text-xs">
				<button onClick={() => {
					if (isRejected) return
					setExtendWithdraw('extend')
				}
				} className={`px-2 flex items-center justify-center w-full h-full ${extendOrWithdraw === 'extend' ? 'text-white bg-gray40' : 'text-gray90 bg-gray30'}`}>Extend</button>
				<button onClick={() => setExtendWithdraw('withdraw')} className={`px-2 flex items-center justify-center w-full h-full border-l border-gray50 ${extendOrWithdraw === 'withdraw' ? 'text-white bg-gray40' : 'text-gray90 bg-gray30'}`}>Withdraw</button>
			</div>

			{extendOrWithdraw === 'extend' ?
				<div>
					<div className="mt-3 mb-5">
						<p className="text-xs mb-1 text-gray100 font-semibold">Current:</p>
						<div className="flex items-center justify-between gap-5">
							<div className="flex items-center justify-center px-3 text-xs w-full max-w-[180px] bg-gray60 h-[40px] rounded-lg">
								number of claims: {currentMaxNumClaims} {updatedNumberOfClaims ? `+ ${updatedNumberOfClaims}` : ''}
							</div>
							<div className="flex items-center justify-center px-3 text-xs w-full bg-gray60 h-[40px] rounded-lg"><DisplaySelectedDate selectedDate={currentEndTime} /></div>
						</div>
						<div className="mt-3 flex items-center justify-center px-3 text-xs w-full max-w-[180px] bg-gray60 h-[40px] rounded-lg">{claimsLeft} claims left</div>
					</div>
					<div className="mt-6">
						<div className="flex items-center mb-2 text-xs justify-between">
							<p className="text-gray100 font-semibold">Extend Time and Claims <span className="text-2xs">(Extend time, Number of claims, or both.)</span></p>
						</div>
						<div className=" enrollment-duration-wrap flex h-[43px] w-full select-none items-center justify-between overflow-hidden rounded-xl border border-gray50 bg-gray30 text-center text-xs text-gray90">
							{enrollmentDurations.map((item) => (
								<div
									key={item.id}
									onClick={() => {
										handleSetEnrollDuration(item.id);
									}}
									className={`enrollment-duration flex h-full w-full cursor-pointer items-center justify-center  border-r-2 border-gray50 ${item.selected ? "bg-gray40 text-white" : ""
										} `}
								>
									<div>{item.name}</div>
								</div>
							))}
						</div>
						<div className="w-full cursor-pointer text-gray100 underline mb-1">
							<EndDateComp handleSetEnrollDuration={handleSetEnrollDuration} enrollmentDurations={enrollmentDurations} updateEndDateTime={updateEndDateTime} setUpdatedEndTime={setUpdatedEndTime} currentEndTime={currentEndTime} />
						</div>
						<DisplaySelectedDate selectedDate={updateEndDateTime} />
						<div className="flex rounded-lg overflow-hidden border mt-5 border-gray50 h-[40px] items-center">
							<div className="flex items-center px-2 bg-gray30 h-full w-[195px] justify-center text-xs font-semibold text-gray100">Number of claims</div>
							<input className="h-full bg-gray50 text-gray100 text-xs w-full pl-2 placeholder-gray80"
								placeholder="1000"
								inputMode="numeric"
								step={1}
								pattern="[0-9]"
								type="text"
								disabled={!!isRefunded}
								value={updatedNumberOfClaims ? updatedNumberOfClaims : ''}
								onChange={(e) => setUpdatedNumberOfClaims(Number(e.target.value.replace(/[^0-9]/g, "")))}
							/>
						</div>
						<div className="flex mt-3  justify-between">
							<div className="text-gray80 text-xs flex justify-end gap-1">
								<div className="min-w-[110px]">Extra Amount to pay:</div>
								<div>{extraPayment + " " + distribute.name}</div>
							</div>
							{insufficient && <div className="text-error text-xs">Insufficient Balance</div>}
						</div>
						<div className="text-error text-xs mt-1">{extendErrorMessage}</div>
						{distribute.tokenAddress !== zeroAddress && !isApproved && updatedNumberOfClaims > 0 && !isRefunded ?
							<button
								disabled={isApproveBtnDisabled}
								onClick={handleApprove}
								className={`absolute bottom-0 left-0 !w-full mt-5 border-2 ${isApproveBtnDisabled && 'opacity-30'} border-gray70 bg-gray40 rounded-lg h-[43px] font-semibold text-sm`}
							>
								{txLoading ? (
									<p>Approving...</p>
								)
									: refundRes?.state === "Retry" ? (
										<p>Retry</p>
									) : (
										<p>{`Approve`}</p>
									)}
							</button> :
							<button
								disabled={isExtendBtnDisabled}
								onClick={handelExtendToken}
								className={`absolute bottom-0 left-0 !w-full mt-5 border-2 ${isExtendBtnDisabled && 'opacity-30'} border-gray70 bg-gray40 rounded-lg h-[43px] font-semibold text-sm`}
							>
								{txLoading ? (
									<p>Extend...</p>
								)
									: refundRes?.state === "Retry" ? (
										<p>Retry</p>
									) : (
										<p>{isRefunded ? `Refunded` : `Extend`}</p>
									)}
							</button>
						}
					</div>
				</div>
				:
				<div>
					<input disabled={!!isRefunded || !isFinished} className="w-full h-[52px] bg-gray30 mt-5 placeholder-gray80 pl-5 rounded-xl"
						placeholder="Paste Wallet Address"
						onChange={(e) => setWithdrawWalletAddress(e.target.value)}
						value={withdrawWalletAddress ?? ''}
					/>
					<div className="text-error text-xs mt-1">{errorMessage}</div>
					<button
						disabled={isWithdrawBtnDisabled}
						onClick={handelWithdrawRemainingTokens}
						className={`absolute bottom-0 left-0 !w-full mt-5 border-2 ${isWithdrawBtnDisabled ? 'border-gray70 bg-gray40 opacity-50' : 'border-gray70 bg-gray40'} rounded-lg h-[43px] font-semibold text-sm`}
					>
						{txLoading ? (
							<p>Withdraw...</p>
						)
							: refundRes?.state === "Retry" ? (
								<p>Retry</p>
							) : (
								<p>{`${isRefunded ? 'Refunded' : !isFinished ? 'Not finished' : 'Withdraw'}`}</p>
							)}
					</button>
				</div>
			}

		</div >
	)
}

export default InitialBody