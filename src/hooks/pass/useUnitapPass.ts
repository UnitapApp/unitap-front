import { Interface } from '@ethersproject/abi';
import UnitapPass_ABI from '../../abis/UnitapPass.json';
import { useUnitapPassContract } from 'hooks/useContract';
import { useWeb3React } from '@web3-react/core';
import { useMemo } from 'react';
import { useSingleContractWithCallData } from '../../lib/hooks/multicall';
import { UnitapPass } from '../../abis/types';

const unitapPassInterface = new Interface(UnitapPass_ABI);

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

  const batchDetailsCall = useMemo(() => {
    if (!account) return [];
    return [unitapPassInterface.encodeFunctionData('balanceOf', [account])];
  }, [account]);

  const [balanceResult] = useSingleContractWithCallData(unitapPassContract, batchDetailsCall);

  const balance: ContractFunctionReturnType<UnitapPass['callStatic']['balanceOf']> | undefined =
    balanceResult?.result?.[0];

  return { balance };
}
