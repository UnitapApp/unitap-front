import { ProviderDashboardFormDataProp } from "@/types";
import { config } from "@/utils/wallet/wagmi";
import { Address, PublicClient, erc721Abi } from "viem";
import { readContracts } from "wagmi/actions";

export const checkNftsAreValid = async (
  data: ProviderDashboardFormDataProp,
  provider: PublicClient,
  nftIds: string[],
  account: string,
) => {
  const results = await readContracts(config, {
    contracts: nftIds.map((item) => ({
      abi: erc721Abi,
      address: data.nftContractAddress as Address,
      functionName: "ownerOf",
      args: [item],
      chainId: Number(data.selectedChain.chainId),
    })),
  });

  console.log(results);
  const resp = results.map((item, key) => ({
    nftId: nftIds[key],
    isOwner: !item.result
      ? false
      : (item.result as string).toLocaleLowerCase() ==
          account.toLocaleLowerCase()
        ? true
        : false,
  }));

  console.log(resp);

  return resp;
};
