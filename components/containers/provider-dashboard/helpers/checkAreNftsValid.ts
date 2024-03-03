import { ProviderDashboardFormDataProp } from "@/types";
import { Address, PublicClient, erc721Abi } from "viem";

export const checkNftsAreValid = async (
  data: ProviderDashboardFormDataProp,
  provider: PublicClient,
  nftIds: string[],
  account: string
) => {
  const results = await provider.multicall({
    contracts: nftIds.map((item) => ({
      abi: erc721Abi,
      address: data.nftContractAddress as Address,
      functionName: "ownerOf",
      args: [item],
    })),
  });

  const resp = results.map((item, key) => ({
    nftId: nftIds[key],
    isOwner: !item.result
      ? false
      : (item.result as string).toLocaleLowerCase() ==
        account.toLocaleLowerCase()
      ? true
      : false,
  }));

  return resp;
};
