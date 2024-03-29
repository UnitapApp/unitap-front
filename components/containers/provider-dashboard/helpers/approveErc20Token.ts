import { ProviderDashboardFormDataProp } from "@/types";
import { fromWei, toWei } from "@/utils/numbersBigNumber";
import { GetContractReturnType, getContract } from "viem";
import { Address, PublicClient, erc20ABI } from "wagmi";
import { GetWalletClientResult } from "wagmi/dist/actions";

export const approveErc20TokenCallback = async (
  address: Address,
  erc20Contract: GetContractReturnType,
  spenderAddress: Address,
  provider: PublicClient,
  signer: GetWalletClientResult,
  decimals: number,
  totalAmount: string
) => {
  const gasEstimate = await provider.estimateContractGas({
    abi: erc20ABI,
    address: erc20Contract.address,
    functionName: "approve",
    account: address,
    args: [spenderAddress, BigInt(toWei(totalAmount.toString(), decimals))],
  });

  const response = await signer?.writeContract({
    abi: erc20ABI,
    address: erc20Contract.address,
    account: address,
    functionName: "approve",
    args: [spenderAddress, BigInt(toWei(totalAmount.toString(), decimals))],
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

export const approveErc20Token = async (
  data: ProviderDashboardFormDataProp,
  provider: PublicClient,
  signer: GetWalletClientResult,
  address: Address,
  setApproveLoading: (e: boolean) => void,
  setIsErc20Approved: (e: boolean) => void,
  setApproveAllowance: (e: number) => void
) => {
  if (!provider || !signer) return;

  const contract = getContract({
    abi: erc20ABI,
    address: data.tokenContractAddress as Address,
    publicClient: provider,
  });

  try {
    setApproveLoading(true);
    const response = await approveErc20TokenCallback(
      address,
      contract,
      data.selectedChain.erc20PrizetapAddr,
      provider,
      signer,
      data.tokenDecimals,
      data.totalAmount
    );

    setApproveLoading(false);
    setIsErc20Approved(true);
    Promise.all([
      contract.read.decimals(),
      contract.read.allowance([
        address as Address,
        data.selectedChain.erc20PrizetapAddr,
      ]),
    ]).then(([r1, r2]) => {
      setApproveAllowance(Number(fromWei(r2.toString(), r1)));
    });
    return response;
  } catch (e: any) {
    console.log(e);
    setApproveLoading(false);
  }
};
