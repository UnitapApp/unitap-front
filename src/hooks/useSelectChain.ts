import { useWeb3React } from '@web3-react/core';
import { useCallback } from 'react';
import { addPopup } from 'state/application/reducer';
import { useAppDispatch } from 'state/hooks';
import { switchChain } from 'utils/switchChain';
import { Chain } from '../types';

export default function useSelectChain() {
	const dispatch = useAppDispatch();
	const { connector } = useWeb3React();

	return useCallback(
		async (targetChain: Chain) => {
			if (!connector) return;

			try {
				await switchChain(connector, targetChain);
			} catch (error) {
				console.error('Failed to switch networks', error);

				dispatch(addPopup({ content: { failedSwitchNetwork: targetChain }, key: `failed-network-switch` }));
			}
		},
		[connector, dispatch],
	);
}
