import { ProviderDashboardFormDataProp } from "@/types";
import { Address, getContract } from "viem";
import { PublicClient, erc721ABI } from "wagmi";

export const getErc721TokenContract = async (
  data: ProviderDashboardFormDataProp,
  address: string,
  provider: PublicClient,
  setData: any,
  setIsApprovedAll: any,
  handleSetContractStatus: any
) => {
  if (!provider || !address) return;

  const contract = getContract({
    abi: erc721ABI,
    address: data.nftContractAddress as any,
    publicClient: provider,
  });

  if (!contract) return;

  try {
    await contract.read.ownerOf([1n]);
  } catch (e) {
    handleSetContractStatus(true, false, false, true)
    return;
  }

  Promise.all([
    contract.read.name(),
    contract.read.symbol(),
    contract.read.balanceOf([address as any]),
    contract.read.isApprovedForAll(
      [address as Address,
      data.selectedChain.erc721PrizetapAddr]
    ),
  ]).then(([r1, r2, r3, r5]) => {
    setData((prevData: any) => ({
      ...prevData,
      nftName: r1,
      nftSymbol: r2,
      userNftBalance: r3?.toString(),
    }));
    handleSetContractStatus(true, true, false, true)
    setIsApprovedAll(r5);
  });
};
