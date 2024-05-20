import { Chain, ProviderDashboardFormDataProp } from "@/types";
import { fromWei, toWei } from "@/utils/numbersBigNumber";
import {
  GetContractReturnType,
  PublicClient,
  getContract,
  Address,
  erc20Abi,
} from "viem";

import { GetWalletClientReturnType } from "wagmi/actions";

export const approveErc20Callback = async (
  address: Address,
  erc20Contract: GetContractReturnType,
  spenderAddress: Address,
  provider: PublicClient,
  signer: GetWalletClientReturnType,
  totalAmount: bigint,
) => {
  const response = await signer?.writeContract({
    abi: erc20Abi,
    address: erc20Contract.address,
    account: address,
    functionName: "approve",
    args: [spenderAddress, totalAmount],
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

export const approveErc20 = async (
  provider: PublicClient,
  signer: GetWalletClientReturnType,
  address: Address,
  tokenContractAddress: any,
  setIsApproved: (e: boolean) => void,
  setApproveAllowance: any,
  spenderAddress: any,
  totalAmount: bigint,
) => {
  if (!provider || !signer) return;
  const contract = getContract({
    abi: erc20Abi,
    address: tokenContractAddress as Address,
    client: provider,
  });

  try {
    const response = await approveErc20Callback(
      address,
      contract,
      spenderAddress,
      provider,
      signer,
      totalAmount,
    );
    setIsApproved(true);
    Promise.all([
      contract.read.decimals(),
      contract.read.allowance([address as Address, spenderAddress]),
    ]).then(([r1, r2]) => {
      setApproveAllowance(Number(fromWei(r2.toString(), r1)));
    });
    return response;
  } catch (e: any) {
    console.log(e);
  }
};
