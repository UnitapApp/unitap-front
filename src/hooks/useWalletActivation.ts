import { useCallback } from 'react';
import { useAppDispatch } from 'state/hooks';
import { updateSelectedWallet } from 'state/user/reducer';

import { injectedConnection } from '../connection';
import { getConnection } from '../connection/utils';

export default function useWalletActivation() {
  const dispatch = useAppDispatch();
  const tryActivation = useCallback(async () => {
    const connector = injectedConnection.connector;
    const connectionType = getConnection(connector).type;
    try {
      await connector.activate();
      dispatch(updateSelectedWallet({ wallet: connectionType }));
    } catch (error: any) {
      console.debug(`web3-react connection error: ${error}`);
    }
  }, [dispatch]);
  return { tryActivation };
}
