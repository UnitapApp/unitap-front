import { createContext, ReactNode, useState } from 'react';

export const LearnTapContext = createContext<{
	searchPhrase: string;
	changeSearchPhrase: ((newSearchPhrase: string) => void) | null;
}>({
	searchPhrase: '',
	changeSearchPhrase: null,
});

const LearnTapProvider = ({ children }: { children: ReactNode }) => {
	const [searchPhrase, setSearchPhrase] = useState<string>('');

	return (
		<LearnTapContext.Provider
			value={{
				searchPhrase,
				changeSearchPhrase: setSearchPhrase,
			}}
		>
			{children}
		</LearnTapContext.Provider>
	);
};

export default LearnTapProvider;
