import {
  ContractValidationStatus,
  ProviderDashboardFormDataProp,
} from "@/types";
import { fromWei } from "@/utils/numbersBigNumber";
import { Address } from "viem";
import { PublicClient, erc20Abi } from "viem";
import { config } from "@/utils/wallet/wagmi";
import { readContracts } from "wagmi/actions";

export const getErc20TokenContract = async (
  data: ProviderDashboardFormDataProp,
  address: string,
  provider: PublicClient,
  setData: any,
  setTokenContractStatus: any,
  setIsErc20Approved: any,
  setApproveAllowance: any,
  spenderAddress: Address,
) => {
  if (!provider || !address) return;

  const functionName = ["name", "symbol", "decimals", "balanceOf", "allowance"];

  const tokenContract = {
    abi: erc20Abi,
    address: data.tokenContractAddress as Address,
  };

  const contracts = [];

  for (let i = 0; i < functionName.length; i++) {
    contracts.push({
      ...tokenContract,
      functionName: functionName[i],
      chainId: Number(data.selectedChain.chainId),
      args:
        functionName[i] === "balanceOf"
          ? [address as Address]
          : functionName[i] === "allowance"
            ? [address as Address, spenderAddress]
            : [],
    });
  }

  const result = await readContracts(config, {
    contracts: contracts,
  });

  if (
    result[0].error ||
    result[1].error ||
    result[2].error ||
    result[3].error ||
    result[4].error
  ) {
    setTokenContractStatus((prev: any) => ({
      ...prev,
      isValid: ContractValidationStatus.NotValid,
      checking: false,
    }));
    setIsErc20Approved(false);
    return;
  } else {
    setData((prevData: any) => ({
      ...prevData,
      tokenName: result[0].result,
      tokenSymbol: result[1].result,
      tokenDecimals: result[2].result,
      userTokenBalance: result[3].result?.toString(),
    }));
    setApproveAllowance(
      Number(fromWei(result[4].result.toString(), Number(result[2].result))),
    );
    setTokenContractStatus((prev: any) => ({
      ...prev,
      isValid: ContractValidationStatus.Valid,
      checking: false,
    }));
  }
};
