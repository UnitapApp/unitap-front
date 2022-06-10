import { useCallback } from 'react';
import { injected } from 'connectors';
import { useWeb3React } from '@web3-react/core';

const useWeb3Connector = () => {
  const { activate: activateNetwork } = useWeb3React();
  const connect = useCallback(async () => {
    try {
      await activateNetwork(injected, console.log, true);
    } catch (ex) {
      console.log(ex);
    }
  }, [activateNetwork]);
  return { connect };
};

export default useWeb3Connector;
