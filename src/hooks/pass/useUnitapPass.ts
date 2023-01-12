import { useUnitapPassContract } from 'hooks/useContract';
import { useWeb3React } from '@web3-react/core';
import { useEffect, useState } from 'react';
import { UnitapPassMain } from '../../abis/types';

export type ContractFunctionReturnType<T> = T extends (...args: any) => Promise<infer R>
  ? // TODO: handle struct return type
    R extends [...params: any[]]
    ? any[]
    : R extends void
    ? void
    : R
  : any;

export function useUnitapPass() {
  const unitapPassContract = useUnitapPassContract();
  const { account } = useWeb3React();
  const [balance, setBalance] = useState<ContractFunctionReturnType<UnitapPassMain['callStatic']['balanceOf']> | undefined>(
    undefined,
  );

  useEffect(() => {
    const f = async () => {
      if (!unitapPassContract || !account) return;
      Promise.all([unitapPassContract.balanceOf(account)]).then(([r1]) => setBalance(r1));
    };
    f();
  }, [unitapPassContract, account]);

  return { balance };
}
