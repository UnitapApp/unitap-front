import { Interface } from '@ethersproject/abi';
import UnitapPassBatchSale_ABI from '../../abis/UnitapPassBatchSale.json';
import { useUnitapPassBatchSaleContract } from 'hooks/useContract';
import { useWeb3React } from '@web3-react/core';
import { useMemo } from 'react';
import { useSingleContractWithCallData } from '../../lib/hooks/multicall';
import { UnitapPassBatchSale } from '../../abis/types';

const unitapPassBatchSaleInterface = new Interface(UnitapPassBatchSale_ABI);

export type ContractFunctionReturnType<T> = T extends (...args: any) => Promise<infer R>
  ? // TODO: handle struct return type
    R extends [...params: any[]]
    ? any[]
    : R extends void
    ? void
    : R
  : any;

export function useUnitapBatchSale() {
  const unitapPassBatchSaleContract = useUnitapPassBatchSaleContract();
  const { account } = useWeb3React();

  const batchDetailsCall = useMemo(() => {
    if (!account) return [];
    return [
      unitapPassBatchSaleInterface.encodeFunctionData('price', []),
      unitapPassBatchSaleInterface.encodeFunctionData('batchSize', []),
      unitapPassBatchSaleInterface.encodeFunctionData('batchSoldCount', []),
    ];
  }, [account]);

  const [priceResult, batchSizeResult, batchSoldCountResult] = useSingleContractWithCallData(
    unitapPassBatchSaleContract,
    batchDetailsCall,
  );
  const price: ContractFunctionReturnType<UnitapPassBatchSale['callStatic']['price']> | undefined =
    priceResult?.result?.[0];
  const batchSize: ContractFunctionReturnType<UnitapPassBatchSale['callStatic']['batchSize']> | undefined =
    batchSizeResult?.result?.[0];
  const batchSoldCount: ContractFunctionReturnType<UnitapPassBatchSale['callStatic']['batchSoldCount']> | undefined =
    batchSoldCountResult?.result?.[0];

  return { price, batchSize, batchSoldCount };
}
