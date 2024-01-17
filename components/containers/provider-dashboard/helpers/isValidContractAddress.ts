import { PublicClient } from "viem";

export const isValidContractAddress = 
	async (contractAddress: string, provider: PublicClient) => {
		try {
			const res = await provider?.getBytecode({
				address: contractAddress as any,
			});
			return res != "0x";
		} catch {
			return false;
		}
	}
