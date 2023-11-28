import { ProviderDashboardFormDataProp } from "@/types";
import { fromWei } from "@/utils";
import { getContract } from "viem";
import { PublicClient, erc20ABI } from "wagmi";

export const getErc20TokenContract = async (
  data: ProviderDashboardFormDataProp,
  address: string,
  provider: PublicClient,
  setCheckingContractInfo: any,
  setIsContractAddressValid: any,
  setData: any,
  setIsErc20Approved: any,
  setCanDisplayErrors: any
) => {
  if (!provider || !address) return;

  const contract = getContract({
    abi: erc20ABI,
    address: address as any,
    publicClient: provider,
  });

  if (!contract) return;

  try {
    await contract.read.decimals();
  } catch (e) {
    setIsContractAddressValid(false);
    setCheckingContractInfo(false);
    setCanDisplayErrors(true);
    return;
  }

  Promise.all([
    contract.read.name(),
    contract.read.symbol(),
    contract.read.decimals(),
    contract.read.balanceOf(address as any),
    contract.read.allowance(
      address as any,
      data.selectedChain.erc20PrizetapAddr
    ),
  ]).then(([r1, r2, r3, r4, r5]) => {
    setData((prevData: any) => ({
      ...prevData,
      tokenName: r1,
      tokenSymbol: r2,
      tokenDecimals: r3,
      userTokenBalance: r4?.toString(),
    }));

    setIsErc20Approved(
      Number(fromWei(r5.toString(), r3)) != 0 &&
        Number(fromWei(r5.toLocaleString(), r3)) >= Number(data.tokenAmount)
    );
    setIsContractAddressValid(true);
    setCheckingContractInfo(false);
  });
};