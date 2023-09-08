import { useContext } from 'react';
import { TokenTapContext } from './tokenTapContext';

export function useTokenTap() {
	const context = useContext(TokenTapContext);

	if (!context) {
		throw new Error('useTokenTap must be used within a TokenTapProvider');
	}

	return context;
}
