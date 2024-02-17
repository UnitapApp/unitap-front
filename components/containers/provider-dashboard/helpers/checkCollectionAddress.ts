import { PublicClient, erc20ABI, erc721ABI, readContracts } from "wagmi";

export const checkNftCollectionAddress = async (
  provider: PublicClient,
  collectionAddress: string,
  chainId: number
) => {
  if (!provider) return false;

  const contracts = [
    {
      abi: erc721ABI,
      address: collectionAddress as any,
      functionName: "name",
      chainId: chainId,
    },
    {
      abi: erc721ABI,
      address: collectionAddress as any,
      functionName: "symbol",
      chainId: chainId,
    },
    {
      abi: erc721ABI,
      address: collectionAddress as any,
      functionName: "ownerOf",
      args: [1n],
      chainId: chainId,
    },
  ];

  const data = await readContracts({
    contracts,
  });
  const res = data.filter((item) => item.status === "success");
  return res.length === 3;
};

export const checkTokenContractAddress = async (
  provider: PublicClient,
  collectionAddress: string,
  chainId: number,
  setDecimals: (decimal: number) => void
) => {
  if (!provider) return false;

  const contracts = [
    {
      abi: erc20ABI,
      address: collectionAddress as any,
      functionName: "name",
      chainId: chainId,
    },
    {
      abi: erc20ABI,
      address: collectionAddress as any,
      functionName: "symbol",
      chainId: chainId,
    },
    {
      abi: erc20ABI,
      address: collectionAddress as any,
      functionName: "decimals",
      chainId: chainId,
    },
  ];

  const data = await readContracts({
    contracts,
  });

  const res = data.filter((item) => item.status === "success");
  if (!res[2]) {
    return false;
  }
  setDecimals(Number(res[2].result));
  return res.length === 3;
};
