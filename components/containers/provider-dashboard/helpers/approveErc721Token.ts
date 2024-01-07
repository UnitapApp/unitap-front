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
  console.log(erc721Contract.address, spenderAddress, address);
  const gasEstimate = await provider.estimateContractGas({
    abi: erc721ABI,
    address: erc721Contract.address,
    functionName: "setApprovalForAll",
    account: address,
    args: [spenderAddress, true],
  });

  const response = await signer?.writeContract({
    abi: erc721ABI,
    address: erc721Contract.address,
    account: address,
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
  setIsApprovedAll: any
) => {
  if (!provider || !signer) return;

  const contract = getContract({
    abi: erc721ABI,
    address: data.nftContractAddress as Address,
    publicClient: provider,
  });

  try {
    setApproveLoading(true);
    const response = await approveErc721TokenCallback(
      address,
      contract,
      data.selectedChain.erc721PrizetapAddr,
      data.nftContractAddress as Address,
      provider,
      signer
    );

    setApproveLoading(false);
    setIsApprovedAll(true);

    return response;
  } catch (e: any) {
    console.log(e);
    setApproveLoading(false);
  }
};
