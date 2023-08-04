import Modal from 'components/common/Modal/modal';
import { FC, PropsWithChildren, createContext, useState } from 'react';
import Content from './content';

export type FundContextType = {
	isOpen: boolean;
	setIsOpen: (isOpen: boolean) => void;
	chainId: number | undefined;
	setChainId: (chainId: number) => void;
};

export const FundContext = createContext<FundContextType>({
	isOpen: false,
	chainId: undefined,
	setIsOpen: () => undefined,
	setChainId: () => undefined,
});

const FundContextProvider: FC<PropsWithChildren> = ({ children }) => {
	const [isOpen, setIsOpen] = useState(false);
	const [chainId, setChainId] = useState<number>();

	return (
		<>
			<Modal title="Provide Gas Fee" isOpen={isOpen} closeModalHandler={() => setIsOpen(false)}>
				<Content initialChainId={chainId} />
			</Modal>
			<FundContext.Provider
				value={{
					isOpen,
					setIsOpen,
					chainId,
					setChainId,
				}}
			>
				{children}
			</FundContext.Provider>
		</>
	);
};

export default FundContextProvider;
