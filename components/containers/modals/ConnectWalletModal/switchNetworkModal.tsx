import { ClaimButton } from "@/components/ui/Button/button";
import Modal from "@/components/ui/Modal/modal";
import { useGlobalContext } from "@/context/globalProvider";
import { Chain } from "@/types";
import {
	useNetworkSwitcher,
	useWalletNetwork,
} from "@/utils/wallet";
import { useState } from "react";

const RenderWalletBody = ({ chain }: { chain: Chain }) => {
	const { switchChain } = useNetworkSwitcher();

	function renderWrongNetworkBody() {
		return (
			<>
				<img src={chain.logoUrl} />
				<p className="text-sm font-medium text-white mt-2 mb-12 text-center px-4 leading-6">
					You need to switch to the <strong>{chain.chainName}</strong> network.
				</p>


				<ClaimButton
					onClick={() => switchChain(Number(chain.chainId))}
					$width="100%"
					className="!w-full"
					$fontSize="16px"
					data-testid={`chain-claim-action-${chain.pk}`}
				>
					<p>Switch Network</p>
				</ClaimButton>
			</>
		);
	}

	return (
		<div
			className="claim-modal-wrapper flex flex-col items-center justify-center pt-5"
			data-testid={`chain-claim-modal-${chain.pk}`}
		>
			{renderWrongNetworkBody()}
		</div>
	);

}

export const SwitchNetworkModal = ({ chain, isNetWorkWrong, setIsNetWorkWrong }: { chain: Chain, isNetWorkWrong: boolean, setIsNetWorkWrong: (item: boolean) => void }) => {
	return (
		<Modal
			title={'Switch network'}
			size="small"
			isOpen={isNetWorkWrong}
			closeModalHandler={() => setIsNetWorkWrong(false)}
		>
			<div className="flex flex-col items-center justify-center pt-12">
				<RenderWalletBody chain={chain} />
			</div>
		</Modal>
	);
};
