'use client'
import { DropIconWrapper } from "@/components/containers/modals/claimModal.style"
import WrongNetworkBody from "@/components/containers/token-tap/Modals/WrongNetworkBody"
import { UserRafflesProps } from "@/types"
import { useWalletAccount, useWalletNetwork, useWalletProvider, useWalletSigner } from "@/utils/wallet"
import { useState } from "react"
import Icon from "@/components/ui/Icon";
import { ClaimButton } from "@/components/ui/Button/button";
import { refundRemainingPrize } from "@/components/containers/provider-dashboard/helpers/refundRemainingPrize"

const InitialBody = ({ prize }: { prize: UserRafflesProps }) => {
	const { address } = useWalletAccount();
	const { chain: activatedChain } = useWalletNetwork();
	const signer = useWalletSigner();
	const provider = useWalletProvider();
	const [txLoading, setTxLoading] = useState(false)
	const [refundRes, setRefundRes] = useState<any | null>(null)
	const chainId = activatedChain?.id;
	const handelRefundPrize = async () => {
		const raffleId = prize.raffleId;
		const hasWinner = prize.winnerEntries!.length !== 0;
		if (!provider || !signer || !address || !chainId || !raffleId) return
		setTxLoading(true);
		await refundRemainingPrize(provider, signer, address, chainId, raffleId, setRefundRes, hasWinner);
		setTxLoading(false);
	}
	return (
		<div>
			{chainId?.toString() !== prize?.chain.chainId ?

				<WrongNetworkBody
					chain={prize.chain}
					imageUrl={prize.imageUrl}
				/>
				:

				<>
					<DropIconWrapper data-testid={`chain-claim-initial-${prize.chain.pk}`}>
						<Icon iconSrc={prize.chain.logoUrl} width="30px" height="30px" className="mr-2" />
						<p>{prize.prizeName}</p>
					</DropIconWrapper>
					<ClaimButton
						onClick={handelRefundPrize}
						$width="100%"
						$fontSize="16px"
						// disabled={claimTokenSignatureLoading || claimTokenLoading}
						className="!w-full mt-5"
						data-testid={`token-claim-action-${prize.chain.pk}`}
					>
						{txLoading ? (
							<p>Refund your prize...</p>
						)
							: refundRes?.state === "Retry" ? (
								<p>Retry</p>
							) : (
								<p>{`Refund your prize`}</p>
							)}
					</ClaimButton>
				</>
			}
		</div>
	)
}

export default InitialBody