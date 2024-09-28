import { config } from "@/utils/wallet/wagmi";
import { getBytecode } from "@wagmi/core";

export const isValidContractAddress = async (
  contractAddress: string,
  chainId: number,
) => {
  try {
    const res = await getBytecode(config, {
      address: contractAddress as any,
      chainId: chainId,
    });
    if (res == undefined) return false;
    return res != "0x";
  } catch (e) {
    console.log(e);
    return false;
  }
};
