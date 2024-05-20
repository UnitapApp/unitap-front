import { fromWei } from "@/utils/numbersBigNumber";
import { Address, getContract } from "viem";
import { PublicClient, erc20Abi } from "viem";

export const checkErc20Approve = async (
  address: string,
  provider: PublicClient,
  tokenContractAddress: any,
  setApproveAllowance: any,
  spenderAddress: any,
  setUserBalance: any,
) => {
  if (!provider || !address) return;

  const contract = getContract({
    abi: erc20Abi,
    address: tokenContractAddress as any,
    client: provider,
  });

  if (!contract) return;

  Promise.all([
    contract.read.decimals(),
    contract.read.balanceOf([address as Address]),
    contract.read.allowance([address as Address, spenderAddress]),
  ]).then(([r1, r2, r3]) => {
    setApproveAllowance(Number(fromWei(r3.toString(), r1)));
    setUserBalance(fromWei(r2.toString(), r1));
  });
};
