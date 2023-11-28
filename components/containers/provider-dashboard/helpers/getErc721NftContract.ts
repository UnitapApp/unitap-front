import { ProviderDashboardFormDataProp } from "@/types";
import { getContract } from "viem";
import { PublicClient, erc721ABI } from "wagmi";

export const getErc721TokenContract = async (
  data: ProviderDashboardFormDataProp,
  address: string,
  provider: PublicClient,
  setCheckingContractInfo: any,
  setIsContractAddressValid: any,
  setData: any,
  setIsApprovedAll: any,
  setCanDisplayErrors: any
) => {
  if (!provider || !address) return;

  const contract = getContract({
    abi: erc721ABI,
    address: address as any,
    publicClient: provider,
  });

  if (!contract) return;

  try {
    await contract.read.ownerOf([1n]);
  } catch (e) {
    setIsContractAddressValid(false);
    setCheckingContractInfo(false);
    setCanDisplayErrors(true);
    return;
  }

  Promise.all([
    contract.read.name(),
    contract.read.symbol(),
    contract.read.balanceOf(address as any),
    contract.read.isApprovedForAll(
      address as any,
      data.selectedChain.erc721PrizetapAddr
    ),
  ]).then(([r1, r2, r3, r5]) => {
    setData((prevData: any) => ({
      ...prevData,
      nftName: r1,
      nftSymbol: r2,
      userNftBalance: r3?.toString(),
    }));
    setIsContractAddressValid(true);
    setCheckingContractInfo(false);
    setIsApprovedAll(r5);
  });
};
