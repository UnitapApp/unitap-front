import { useUnitapPassBatchSaleContract } from 'hooks/useContract';
import { useEffect, useState } from 'react';
import { UnitapPassBatchSale } from '../../abis/types';

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

  const [price, setPrice] = useState<
    ContractFunctionReturnType<UnitapPassBatchSale['callStatic']['price']> | undefined
  >(undefined);
  const [batchSize, setBatchSize] = useState<
    ContractFunctionReturnType<UnitapPassBatchSale['callStatic']['batchSize']> | undefined
  >(undefined);
  const [batchSoldCount, setBatchSoldCount] = useState<
    ContractFunctionReturnType<UnitapPassBatchSale['callStatic']['batchSoldCount']> | undefined
  >(undefined);

  useEffect(() => {
    const f = async () => {
      if (!unitapPassBatchSaleContract) return;
      Promise.all([
        unitapPassBatchSaleContract.price(),
        unitapPassBatchSaleContract.batchSize(),
        unitapPassBatchSaleContract.batchSoldCount(),
      ]).then(([r1, r2, r3]) => {
        setPrice(r1);
        setBatchSize(r2);
        setBatchSoldCount(r3);
      });
    };
    f();
  }, [unitapPassBatchSaleContract]);

  return { price, batchSize, batchSoldCount };
}
