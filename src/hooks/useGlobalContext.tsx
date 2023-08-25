import { FC, PropsWithChildren, createContext, useState } from 'react';
import { BrightIdModalState, HaveBrightIdAccountModalState, BrightIdConnectionModalState } from 'types';
import { EmptyCallback } from 'utils';

export type GlobalContextType = {
	openBrightIdModal: () => void;
	closeBrightIdModal: () => void;
	brightidModalStatus: BrightIdModalState;
	openHaveBrightIdAccountModal: () => void;
	closeHaveBrightIdAccountModal: () => void;
	haveBrightIdAccountModalStatus: HaveBrightIdAccountModalState;
	openBrightIdConnectionModal: () => void;
	closeBrightIdConnectionModal: () => void;
	brightIdConnectionModalStatus: BrightIdConnectionModalState;
};

export const GlobalContext = createContext<GlobalContextType>({
	openBrightIdModal: EmptyCallback,
	closeBrightIdModal: EmptyCallback,
	brightidModalStatus: BrightIdModalState.CLOSED,
	openHaveBrightIdAccountModal: EmptyCallback,
	closeHaveBrightIdAccountModal: EmptyCallback,
	haveBrightIdAccountModalStatus: HaveBrightIdAccountModalState.CLOSED,
	openBrightIdConnectionModal: EmptyCallback,
	closeBrightIdConnectionModal: EmptyCallback,
	brightIdConnectionModalStatus: BrightIdConnectionModalState.CLOSED,
});

export const GlobalContextProvider: FC<PropsWithChildren> = ({ children }) => {
	const [brightidModalStatus, setBrightidModalStatus] = useState<BrightIdModalState>(BrightIdModalState.CLOSED);

	const [haveBrightIdAccountModalStatus, setHaveBrightIdAccountModalStatus] = useState<HaveBrightIdAccountModalState>(
		HaveBrightIdAccountModalState.CLOSED,
	);

	const [brightIdConnectionModalStatus, setBrightIdConnectionModalStatus] = useState<BrightIdConnectionModalState>(
		BrightIdConnectionModalState.CLOSED,
	);

	const openBrightIdModal = () => {
		setBrightidModalStatus(BrightIdModalState.OPENED);
	};
	const closeBrightIdModal = () => {
		setBrightidModalStatus(BrightIdModalState.CLOSED);
	};

	const openHaveBrightIdAccountModal = () => {
		setHaveBrightIdAccountModalStatus(HaveBrightIdAccountModalState.OPENED);
	};
	const closeHaveBrightIdAccountModal = () => {
		setHaveBrightIdAccountModalStatus(HaveBrightIdAccountModalState.CLOSED);
	};

	const openBrightIdConnectionModal = () => {
		setBrightIdConnectionModalStatus(BrightIdConnectionModalState.OPENED);
	};
	const closeBrightIdConnectionModal = () => {
		setBrightIdConnectionModalStatus(BrightIdConnectionModalState.CLOSED);
	};

	return (
		<GlobalContext.Provider
			value={{
				openBrightIdModal,
				closeBrightIdModal,
				brightidModalStatus,
				openHaveBrightIdAccountModal,
				closeHaveBrightIdAccountModal,
				haveBrightIdAccountModalStatus,
				openBrightIdConnectionModal,
				closeBrightIdConnectionModal,
				brightIdConnectionModalStatus,
			}}
		>
			{children}
		</GlobalContext.Provider>
	);
};

export default GlobalContextProvider;
