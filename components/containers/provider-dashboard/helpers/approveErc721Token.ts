import { contractAddresses } from "@/constants";
import { Chain, ProviderDashboardFormDataProp } from "@/types";
import {
  PublicClient,
  Address,
  getContract,
  GetContractReturnType,
} from "viem";
import { erc20Abi, erc721Abi } from "viem";
import { GetWalletClientReturnType } from "wagmi/actions";

export const approveErc721TokenCallback = async (
  address: Address,
  erc721Contract: GetContractReturnType,
  spenderAddress: Address,
  tokenAddress: Address,
  provider: PublicClient,
  signer: GetWalletClientReturnType,
  selectedChain: Chain,
) => {
  const gasEstimate = await provider.estimateContractGas({
    abi: erc721Abi,
    address: erc721Contract.address,
    functionName: "setApprovalForAll",
    account: address,
    args: [spenderAddress, true],
  });

  const response = await signer?.writeContract({
    abi: erc721Abi,
    address: erc721Contract.address,
    account: address,
    functionName: "setApprovalForAll",
    args: [spenderAddress, true],
    gasPrice: selectedChain.chainId === "42161" ? undefined : gasEstimate,
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
  signer: GetWalletClientReturnType,
  address: Address,
  setApproveLoading: any,
  setIsApprovedAll: any,
  selectedChain: Chain,
) => {
  if (!provider || !signer) return;

  const contract = getContract({
    abi: erc721Abi,
    address: data.nftContractAddress as Address,
    client: provider,
  });

  if (!contractAddresses.prizeTap[selectedChain.chainId].erc721) {
    throw new Error("Error finding address for erc721");
  }

  try {
    setApproveLoading(true);
    const response = await approveErc721TokenCallback(
      address,
      contract,
      contractAddresses.prizeTap[selectedChain.chainId].erc721!,
      data.nftContractAddress as Address,
      provider,
      signer,
      selectedChain,
    );

    setApproveLoading(false);
    setIsApprovedAll(true);

    return response;
  } catch (e: any) {
    console.log(e);
    setIsApprovedAll(false);
    setApproveLoading(false);
  }
};
