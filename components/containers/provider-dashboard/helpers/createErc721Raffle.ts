import { ConstraintParamValues, ProviderDashboardFormDataProp } from "@/types";
import { prizeTap721ABI, prizeTapABI } from "@/types/abis/contracts";
import { Abi, getContract, parseEther } from "viem";
import { PublicClient } from "wagmi";
import { deadline, startAt } from "./deadlineAndStartAt";
import { createRaffleApi, updateCreateRaffleTx } from "@/utils/api";
import { GetContractResult, GetWalletClientResult } from "wagmi/dist/actions";

export const createErc721RaffleCallback = async (
  account: string,
  raffleContract: GetContractResult,
  signer: GetWalletClientResult,
  provider: PublicClient,
  currencyAddress: `0x${string}`,
  nftIds: bigint,
  maxParticipants: bigint,
  startTime: bigint,
  endTime: bigint
) => {
  if (!provider || !signer) return;

  const gasEstimate = await provider.estimateContractGas({
    abi: prizeTap721ABI,
    account: account as any,
    address: raffleContract.address,
    functionName: "createRaffle",
    args: [
      currencyAddress,
      nftIds,
      maxParticipants,
      1n,
      startTime,
      endTime,
      "0x4554480000000000000000000000000000000000000000000000000000000000",
    ],
  });

  return signer?.writeContract({
    abi: prizeTap721ABI,
    account: account as any,
    address: raffleContract.address,
    functionName: "createRaffle",
    args: [
      currencyAddress,
      nftIds,
      maxParticipants,
      1n,
      startTime,
      endTime,
      "0x4554480000000000000000000000000000000000000000000000000000000000",
    ],
    gasPrice: gasEstimate,
  });
};

export const createErc721Raffle = async (
  data: ProviderDashboardFormDataProp,
  provider: PublicClient,
  signer: GetWalletClientResult,
  requirementList: ConstraintParamValues[],
  address: string,
  userToken: string,
  setCreateRaffleLoading: any,
  setCreteRaffleResponse: any
) => {
  const raffleContractAddress = data.selectedChain?.erc721PrizetapAddr;
  const maxNumberOfEntries = data.maxNumberOfEntries
    ? data.maxNumberOfEntries
    : "1000000000";
  const raffleContract: any = getContract({
    address: raffleContractAddress as any,
    abi: prizeTap721ABI,
    publicClient: provider,
  });

  const constraints = requirementList.map((item) => item.pk);

  if (!data.nftTokenIds) return;
  const nfts =
    data.nftTokenIds && data.nftTokenIds?.length > 1
      ? data.nftTokenIds.join(",")
      : data.nftTokenIds[0];
  console.log(nfts);
  const prizeName = data.nftName;

  const raffleData = {
    name: data.provider,
    description: data.description,
    contract: raffleContractAddress,
    creator_name: data.provider,
    prizeAmount: 1,
    decimals: 18,
    creator_address: address,
    prize_asset: data.nftContractAddress,
    prize_name: prizeName,
    prize_symbol: data.nftSymbol,
    chain: Number(data.selectedChain.pk),
    constraints,
    constraint_params: btoa(JSON.stringify({})),
    deadline: deadline(data.endTimeStamp),
    max_number_of_entries: maxNumberOfEntries,
    start_at: startAt(data.startTimeStamp),
    nftIds: nfts,
    isPrizeNft: true,
    winnersCount: data.winnersCount,
  };
  const raffle = await createRaffleApi(userToken, raffleData);

  if (!raffle.success) {
    return false;
  }

  const rafflePk = raffle.data.id;

  try {
    setCreateRaffleLoading(true);

    console.log(
      address,
      raffleContract,
      data.nftContractAddress,
      data.nftTokenIds,
      maxNumberOfEntries,
      data.startTimeStamp,
      data.endTimeStamp
    );

    const response = await createErc721RaffleCallback(
      address,
      raffleContract,
      signer,
      provider,
      data.nftContractAddress as any,
      BigInt(nfts),
      BigInt(maxNumberOfEntries),
      data.startTimeStamp,
      data.endTimeStamp
    );

    if (!response) return;

    await provider.waitForTransactionReceipt({
      hash: response,
      confirmations: 1,
    });

    setCreteRaffleResponse({
      success: true,
      state: "Done",
      txHash: response,
      message: "Created raffle successfully.",
    });

    setCreateRaffleLoading(false);

    await updateCreateRaffleTx(userToken, rafflePk, response);
  } catch (e: any) {
    console.log(e);
    setCreteRaffleResponse({
      success: false,
      state: "Retry",
      message: "Something went wrong. Please try again!",
    });
    setCreateRaffleLoading(false);
  }
};
