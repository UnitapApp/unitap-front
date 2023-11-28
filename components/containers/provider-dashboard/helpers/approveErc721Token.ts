import { ProviderDashboardFormDataProp } from "@/types";
import {
  PublicClient,
  Address,
  getContract,
  GetContractReturnType,
} from "viem";
import { erc20ABI, erc721ABI } from "wagmi";
import { GetWalletClientResult } from "wagmi/dist/actions";

export const approveErc721TokenCallback = async (
  address: Address,
  erc721Contract: GetContractReturnType,
  spenderAddress: Address,
  tokenAddress: Address,
  provider: PublicClient,
  signer: GetWalletClientResult
) => {
  const gasEstimate = await provider.estimateContractGas({
    abi: erc721ABI,
    address,
    functionName: "setApprovalForAll",
    account: erc721Contract.address,
    args: [spenderAddress, true],
  });

  const response = await signer?.writeContract({
    abi: erc721ABI,
    address,
    account: erc721Contract.address,
    functionName: "setApprovalForAll",
    args: [spenderAddress, true],
    gasPrice: gasEstimate,
  });

  if (!response) return;

  await provider.waitForTransactionReceipt({
    hash: response,
    confirmations: 1,
  });

  return {
    hash: response,
  };
};

export const approveErc721Token = async (
  data: ProviderDashboardFormDataProp,
  provider: PublicClient,
  signer: GetWalletClientResult,
  address: Address,
  setApproveLoading: any,
  setIsErc20Approved: any
) => {
  if (!provider || !signer) return;

  const contract = getContract({
    abi: erc20ABI,
    address: data.tokenContractAddress as Address,
    publicClient: provider,
  });

  try {
    setApproveLoading(true);
    const response = await approveErc721TokenCallback(
      address,
      contract,
      data.selectedChain.erc20PrizetapAddr,
      data.tokenContractAddress as Address,
      provider,
      signer
    );

    setApproveLoading(false);
    setIsErc20Approved(true);

    return response;
  } catch (e: any) {
    console.log(e);
    setApproveLoading(false);
  }
};
