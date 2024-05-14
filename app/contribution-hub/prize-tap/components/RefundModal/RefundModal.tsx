"use client";

import { useCallback, useMemo, useState } from "react";
import { UserRafflesProps } from "@/types";
import { useWalletNetwork } from "@/utils/wallet";
import { useUserProfileContext } from "@/context/userProfile";
import Modal from "@/components/ui/Modal/modal";
import BrightNotConnectedBody from "@/components/containers/token-tap/Modals/BrightNotConnectedBody";
import SuccessBody from "./SuccessBody";
import WrongNetworkBody from "@/components/containers/token-tap/Modals/WrongNetworkBody";
import InitialBody from "./InitialBody";

const RefundYourPrizeModalBody = ({ selectedPrizeForRefundPrize }: { selectedPrizeForRefundPrize: UserRafflesProps }) => {
	const { chain: activatedChain } = useWalletNetwork();

	const chainId = activatedChain?.id;

	const { userProfile, } = useUserProfileContext();
	if (!userProfile)
		return (
			<BrightNotConnectedBody
				chainPk={selectedPrizeForRefundPrize.chain.pk}
				imageUrl={selectedPrizeForRefundPrize.imageUrl}
			/>
		);

	// if (
	// 	claimTokenResponse?.state === "Done" ||
	// 	collectedToken?.status === "Verified"
	// )
	// 	return <SuccessBody token={selectedPrizeForRefundPrize} />;

	// if (
	// 	claimTokenResponse?.state === "Pending" ||
	// 	collectedToken?.status === "Pending"
	// ) {
	// 	return <InitialBody token={selectedPrizeForRefundPrize} />;
	// }

	if (chainId?.toString() !== selectedPrizeForRefundPrize?.chain.chainId)
		return (
			<WrongNetworkBody
				chain={selectedPrizeForRefundPrize.chain}
				imageUrl={selectedPrizeForRefundPrize.imageUrl}
			/>
		);

	return <InitialBody prize={selectedPrizeForRefundPrize} />;
};

const RefundYourPrizeModal = ({ prize, setSelectedPrize }: { prize: UserRafflesProps, setSelectedPrize: (items: UserRafflesProps | null) => void }) => {
	const [selectedPrizeForRefundPrize, setSelectedPrizeForRefundPrize
	] = useState<UserRafflesProps | null>(prize)

	const closeRefundYourPrizeModal = useCallback(() => {
		setSelectedPrizeForRefundPrize(null);
		setSelectedPrize(null);
	}, [setSelectedPrizeForRefundPrize, setSelectedPrize]);

	const isOpen = useMemo(() => {
		return !!selectedPrizeForRefundPrize;
	}, [selectedPrizeForRefundPrize]);

	if (!selectedPrizeForRefundPrize) return null;

	return (
		<Modal
			title={`Refund your prize`}
			size="small"
			closeModalHandler={closeRefundYourPrizeModal}
			isOpen={isOpen}
		>
			<div className="claim-modal-wrapper flex flex-col items-center justify-center pt-5">
				<RefundYourPrizeModalBody selectedPrizeForRefundPrize={selectedPrizeForRefundPrize} />
			</div>
		</Modal>
	);
};
export default RefundYourPrizeModal;