import useActiveWeb3React from './useActiveWeb3React';
import { useCallback } from 'react';
import { injected } from '../connectors';

export default () => {
  const { activate } = useActiveWeb3React();
  const connect = useCallback(async () => {
    try {
      await activate(injected);
    } catch (ex) {
      console.log(ex);
    }
  }, [activate]);
  return { connect };
};
