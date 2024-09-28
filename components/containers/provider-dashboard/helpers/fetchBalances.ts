import { config } from "@/utils/wallet/wagmi";
import { erc20Abi } from "viem";
import { readContracts } from "wagmi/actions";

export const fetchBalances = async (
  addresses: string[],
  userWalletAddress: `0x${string}`,
  chainId: number,
) => {
  const tokenContracts = [];
  for (let i = 0; i < addresses.length; i++) {
    const tokenAddress = addresses[i];
    tokenContracts.push({
      abi: erc20Abi,
      address: tokenAddress,
      functionName: "balanceOf",
      args: [userWalletAddress],
      chainId,
    });
  }

  const data = await readContracts(config, {
    contracts: tokenContracts as any,
  });

  return data;
};
