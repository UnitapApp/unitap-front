"use client";

import { useCallback, useMemo, useState } from "react";
import { UserTokenDistribution } from "@/types";
import { useWalletNetwork } from "@/utils/wallet";
import { useUserProfileContext } from "@/context/userProfile";
import Modal from "@/components/ui/Modal/modal";
import BrightNotConnectedBody from "@/components/containers/token-tap/Modals/BrightNotConnectedBody";
import SuccessBody from "./SuccessBody";
import WrongNetworkBody from "./WrongNetworkBody";
import InitialBody from "./InitialBody";

const ExtendTokenModalBody = ({ selectedDistributeForExtend }: { selectedDistributeForExtend: UserTokenDistribution }) => {
	const { chain: activatedChain } = useWalletNetwork();

	const chainId = activatedChain?.id;

	const { userProfile, } = useUserProfileContext();
	if (!userProfile)
		return (
			<BrightNotConnectedBody
				chainPk={selectedDistributeForExtend.chain.pk}
				imageUrl={selectedDistributeForExtend.imageUrl}
			/>
		);

	// if (
	// 	claimTokenResponse?.state === "Done" ||
	// 	collectedToken?.status === "Verified"
	// )
	// 	return <SuccessBody token={selectedDistributeForExtend} />;

	// if (
	// 	claimTokenResponse?.state === "Pending" ||
	// 	collectedToken?.status === "Pending"
	// ) {
	// 	return <InitialBody token={selectedDistributeForExtend} />;
	// }

	if (chainId?.toString() !== selectedDistributeForExtend?.chain.chainId)
		return (
			<WrongNetworkBody
				chain={selectedDistributeForExtend.chain}
				imageUrl={selectedDistributeForExtend.chain.logoUrl}
			/>
		);

	return <InitialBody distribute={selectedDistributeForExtend} />;
};

const ExtendTokenModal = ({ distribute, setSelectedDistribute }: { distribute: UserTokenDistribution | null, setSelectedDistribute: (items: UserTokenDistribution | null) => void }) => {

	const closeExtendTokenModal = useCallback(() => {
		setSelectedDistribute(null);
	}, [setSelectedDistribute]);

	const isOpen = useMemo(() => {
		return !!distribute;
	}, [distribute]);

	if (!distribute) return null;

	return (
		<Modal
			title={`Extend / Withdraw`}
			size="small"
			closeModalHandler={closeExtendTokenModal}
			isOpen={isOpen}
			className="provider-dashboard__modal"
		>
			<div className=" flex flex-col pt-5">
				<ExtendTokenModalBody selectedDistributeForExtend={distribute} />
			</div>
		</Modal>
	);
};
export default ExtendTokenModal;