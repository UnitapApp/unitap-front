import {
  ContractValidationStatus,
  ProviderDashboardFormDataProp,
} from "@/types";
import { Address, getContract } from "viem";
import { PublicClient, erc20ABI } from "wagmi";
import { fromWei } from "@/utils/numbersBigNumber";
import { contractAddresses } from "@/constants/address";

export const getErc20TokenContractTokenTap = async (
  data: ProviderDashboardFormDataProp,
  address: string,
  provider: PublicClient,
  setData: any,
  setTokenContractStatus: any,
  setIsErc20Approved: any,
  setApproveAllowance: any
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
    setIsErc20Approved(false);
    return;
  }

  Promise.all([
    contract.read.name(),
    contract.read.symbol(),
    contract.read.decimals(),
    contract.read.balanceOf([address as Address]),
    contract.read.allowance([
      address as Address,
      contractAddresses.tokenTap as any,
    ]),
  ]).then(([r1, r2, r3, r4, r5]) => {
    setData((prevData: any) => ({
      ...prevData,
      tokenName: r1,
      tokenSymbol: r2,
      tokenDecimals: r3,
      userTokenBalance: r4?.toString(),
    }));
    setApproveAllowance(Number(fromWei(r5.toString(), r3)));
    setTokenContractStatus((prev: any) => ({
      ...prev,
      isValid: ContractValidationStatus.Valid,
      checking: false,
    }));
  });
};
