import { contractAddresses } from "@/constants";
import {
  ContractValidationStatus,
  ProviderDashboardFormDataProp,
} from "@/types";
import { config } from "@/utils/wallet/wagmi";
import { Address, getContract, PublicClient, erc721Abi } from "viem";
import { readContracts } from "wagmi/actions";

export const getErc721TokenContract = async (
  data: ProviderDashboardFormDataProp,
  address: string,
  provider: PublicClient,
  setData: any,
  setIsApprovedAll: any,
  setNftContractStatus: any,
) => {
  if (!provider || !address) return;

  const functionName = ["name", "symbol", "balanceOf", "isApprovedForAll"];

  const nftContract = {
    abi: erc721Abi,
    address: data.nftContractAddress as Address,
  };

  const contracts = [];

  for (let i = 0; i < functionName.length; i++) {
    contracts.push({
      ...nftContract,
      functionName: functionName[i],
      chainId: Number(data.selectedChain.chainId),
      args:
        functionName[i] === "balanceOf"
          ? [address as Address]
          : functionName[i] === "isApprovedForAll"
            ? [
                address as Address,
                contractAddresses.prizeTap[data.selectedChain.chainId].erc721,
              ]
            : [],
    });
  }

  const result = await readContracts(config, {
    contracts: contracts,
  });

  console.log(result);
  if (
    result[0].error ||
    result[1].error ||
    result[2].error ||
    result[3].error
  ) {
    setNftContractStatus((prev: any) => ({
      ...prev,
      isValid: ContractValidationStatus.NotValid,
      checking: false,
    }));
    return;
  } else {
    setData((prevData: any) => ({
      ...prevData,
      nftName: result[0].result,
      nftSymbol: result[1].result,
      userNftBalance: result[2].result?.toString(),
    }));
    setNftContractStatus((prev: any) => ({
      ...prev,
      isValid: ContractValidationStatus.Valid,
      checking: false,
    }));
    setIsApprovedAll(result[3].result);
  }

  // const contract = getContract({
  //   abi: erc721Abi,
  //   address: data.nftContractAddress as any,
  //   client: provider,
  // });

  // if (!contract) return;

  // try {
  //   await contract.read.ownerOf([1n]);
  // } catch (e) {
  //   console.log(e);
  //   setNftContractStatus((prev: any) => ({
  //     ...prev,
  //     isValid: ContractValidationStatus.NotValid,
  //     checking: false,
  //   }));
  //   return;
  // }

  // Promise.all([
  //   contract.read.name(),
  //   contract.read.symbol(),
  //   contract.read.balanceOf([address as any]),
  //   contract.read.isApprovedForAll([
  //     address as Address,
  //     contractAddresses.prizeTap[data.selectedChain.chainId].erc721 as any,
  //   ]),
  // ]).then(([r1, r2, r3, r5]) => {
  //   setData((prevData: any) => ({
  //     ...prevData,
  //     nftName: r1,
  //     nftSymbol: r2,
  //     userNftBalance: r3?.toString(),
  //   }));
  //   setNftContractStatus((prev: any) => ({
  //     ...prev,
  //     isValid: ContractValidationStatus.Valid,
  //     checking: false,
  //   }));
  //   setIsApprovedAll(r5);
  // });
};
