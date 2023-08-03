import { useContext } from 'react';
import { Text } from 'components/basic/Text/text.style';
import { UserProfileContext } from 'hooks/useUserProfile';

import { ClaimButton, WhiteOutlinedButton } from 'components/basic/Button/button';

import { BrightIdModalState } from 'types';
import BrightStatusModal from '../BrightStatusModal/brightStatusModal';
import Modal from 'components/common/Modal/modal';
import Icon from 'components/basic/Icon/Icon';
import { GlobalContext } from 'hooks/useGlobalContext';

const ConnectBrightIdModalContent = () => {
	const { userProfile, loading } = useContext(UserProfileContext);
	const tried = false;
	const { closeBrightIdModal, openHaveBrightIdAccountModal, openBrightIdConnectionModal } = useContext(GlobalContext);

	const handleHaveBrightIdClicked = () => {
		closeBrightIdModal();
		openHaveBrightIdAccountModal();
	};

	const handleBrightIdConnectClicked = () => {
		closeBrightIdModal();
		openBrightIdConnectionModal();
	};

	if (userProfile?.isMeetVerified) {
		return <BrightStatusModal success={true}></BrightStatusModal>;
	}

	return (
		<div
			className="bright-connection-modal flex flex-col items-center justify-center pt-2"
			data-testid="brightid-modal"
		>
			<Icon
				data-testid="brightid-logo"
				className="bright-logo !w-4/12 z-10 mb-5"
				iconSrc="assets/images/modal/bright-id-logo.svg"
			/>
			<p className="text-sm font-bold text-white mb-2">Login with BrightID</p>
			<p className="text-xs font-medium text-gray100 mb-5 text-center px-4 leading-6">
				BrightID is a social identity network that allows users to prove that they are only using one account.
			</p>
			{loading && <Text data-testid={`loading`}>Loading...</Text>}
			<WhiteOutlinedButton
				data-testid="setup-bright-id-qr-code"
				className="mb-4 !w-full bg-gray30"
				onClick={handleBrightIdConnectClicked}
			>
				I have a BrightID
			</WhiteOutlinedButton>

			<ClaimButton
				data-testid={`bright-id-connection-refresh-button${tried ? '-try-again' : ''}`}
				onClick={handleHaveBrightIdClicked}
				className="!w-full mb-4"
			>
				<p className="font-semibold">Create my BrightID</p>
			</ClaimButton>

			<p className="text-xs font-light text-gray100">
				you can create a BrightID account and get verified in 2 simple steps
			</p>
		</div>
	);
};

const ConnectBrightIdModal = () => {
	const { brightidModalStatus, closeBrightIdModal } = useContext(GlobalContext);

	return (
		<Modal
			title=""
			size="small"
			isOpen={brightidModalStatus !== BrightIdModalState.CLOSED}
			closeModalHandler={closeBrightIdModal}
		>
			<ConnectBrightIdModalContent />
		</Modal>
	);
};

export default ConnectBrightIdModal;
