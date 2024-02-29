import { contractAddresses } from "@/constants";
import {
  ContractValidationStatus,
  ProviderDashboardFormDataProp,
} from "@/types";
import { Address, getContract, PublicClient, erc721Abi } from "viem";

export const getErc721TokenContract = async (
  data: ProviderDashboardFormDataProp,
  address: string,
  provider: PublicClient,
  setData: any,
  setIsApprovedAll: any,
  setNftContractStatus: any
) => {
  if (!provider || !address) return;

  const contract = getContract({
    abi: erc721Abi,
    address: data.nftContractAddress as any,
    client: provider,
  });

  if (!contract) return;

  try {
    await contract.read.ownerOf([1n]);
  } catch (e) {
    setNftContractStatus((prev: any) => ({
      ...prev,
      isValid: ContractValidationStatus.NotValid,
      checking: false,
    }));
    return;
  }

  Promise.all([
    contract.read.name(),
    contract.read.symbol(),
    contract.read.balanceOf([address as any]),
    contract.read.isApprovedForAll([
      address as Address,
      contractAddresses.prizeTapErc721 as any,
    ]),
  ]).then(([r1, r2, r3, r5]) => {
    setData((prevData: any) => ({
      ...prevData,
      nftName: r1,
      nftSymbol: r2,
      userNftBalance: r3?.toString(),
    }));
    setNftContractStatus((prev: any) => ({
      ...prev,
      isValid: ContractValidationStatus.Valid,
      checking: false,
    }));
    setIsApprovedAll(r5);
  });
};
