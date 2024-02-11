import {
  ContractValidationStatus,
  ProviderDashboardFormDataProp,
} from "@/types";
import { Address, getContract } from "viem";
import { PublicClient, erc20ABI } from "wagmi";

export const getErc20TokenContractTokenTap = async (
  data: ProviderDashboardFormDataProp,
  address: string,
  provider: PublicClient,
  setData: any,
  setTokenContractStatus: any
) => {
  if (!provider || !address) return;

  const contract = getContract({
    abi: erc20ABI,
    address: data.tokenContractAddress as any,
    publicClient: provider,
  });

  if (!contract) return;

  try {
    await contract.read.decimals();
  } catch (e) {
    setTokenContractStatus((prev: any) => ({
      ...prev,
      isValid: ContractValidationStatus.NotValid,
      checking: false,
    }));
    return;
  }

  Promise.all([
    contract.read.name(),
    contract.read.symbol(),
    contract.read.decimals(),
    contract.read.balanceOf([address as Address]),
  ]).then(([r1, r2, r3, r4]) => {
    setData((prevData: any) => ({
      ...prevData,
      tokenName: r1,
      tokenSymbol: r2,
      tokenDecimals: r3,
      userTokenBalance: r4?.toString(),
    }));
    setTokenContractStatus((prev: any) => ({
      ...prev,
      isValid: ContractValidationStatus.Valid,
      checking: false,
    }));
  });
};
