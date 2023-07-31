import { useCallback, useContext, useState } from 'react';
import { Text } from 'components/basic/Text/text.style';
import { UserProfileContext } from 'hooks/useUserProfile';

import { ClaimButton } from 'components/basic/Button/button';
import BrightStatusModal from '../BrightStatusModal/brightStatusModal';
import Modal from 'components/common/Modal/modal';
import Icon from 'components/basic/Icon/Icon';
import useGenerateKeys from 'hooks/useGenerateKeys';
import { GlobalContext } from 'hooks/useGlobalContext';

const ConnectMetamaskModalContent = () => {
	const { userProfile, refreshUserProfile, loading } = useContext(UserProfileContext);
	const [tried] = useState(false);
	const { keys } = useGenerateKeys();
	const [signedPrivateKey] = useState<string | null>(null);

	const refreshConnectionButtonAction = useCallback(async () => {
		if (!refreshUserProfile || loading || !keys?.address || !signedPrivateKey) {
			return;
		}

		refreshUserProfile(keys?.address, signedPrivateKey);
	}, [refreshUserProfile, loading, keys?.address, signedPrivateKey]);

	if (userProfile?.isMeetVerified) {
		return <BrightStatusModal success={true}></BrightStatusModal>;
	} else if (userProfile?.isMeetVerified === false) {
		return <BrightStatusModal success={false}></BrightStatusModal>;
	}

	return (
		<div
			className="bright-connection-modal flex flex-col items-center justify-center pt-12"
			data-testid="brightid-modal"
		>
			<Icon
				data-testid="brightid-qr"
				className="qr-code !w-4/12 z-10 mb-16"
				iconSrc="assets/images/modal/metamask-icon.svg"
			/>
			<p className="text-sm font-medium text-gray100 mb-3 mr-auto">Don’t have a metamask wallet?</p>
			<p className="text-sm text-gray90 mb-6 mr-auto">
				Go to <span className="text-orange"> Metamask.io </span> and create your first wallet and come back to start
				with web3
			</p>
			{loading && <Text data-testid={`loading`}>Loading...</Text>}
			{refreshUserProfile && (
				<ClaimButton
					data-testid={`bright-id-connection-refresh-button${tried ? '-try-again' : ''}`}
					onClick={refreshConnectionButtonAction}
					className="!w-full"
				>
					{tried ? (
						<p className="font-semibold">Scan or Use Link and Try Again</p>
					) : (
						<p className="font-semibold">Connect Wallet</p>
					)}
				</ClaimButton>
			)}
		</div>
	);
};

const ConnectMetamaskModal = () => {
	const { closeBrightIdModal } = useContext(GlobalContext);
	return (
		<Modal
			title="Connect Metamask"
			size="small"
			// isOpen={brightidModalStatus !== BrightIdModalState.CLOSED}
			isOpen={false}
			closeModalHandler={closeBrightIdModal}
		>
			<ConnectMetamaskModalContent />
		</Modal>
	);
};

export default ConnectMetamaskModal;
