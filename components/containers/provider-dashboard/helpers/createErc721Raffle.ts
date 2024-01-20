import { RequirementProps, ProviderDashboardFormDataProp } from "@/types";
import { prizeTap721ABI } from "@/types/abis/contracts";
import {  getContract } from "viem";
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
  nftIds: string[],
  maxParticipants: bigint,
  startTime: bigint,
  endTime: bigint,
) => {
  if (!provider || !signer) return;

  const gasEstimate = await provider.estimateContractGas({
    abi: prizeTap721ABI,
    account: account as any,
    address: raffleContract.address,
    functionName: "createRaffle",
    args: [
      currencyAddress,
      nftIds.map(item => BigInt(item)),
      maxParticipants,
      1n,
      startTime,
      endTime,
      BigInt(nftIds.length),
      "0x0000000000000000000000000000000000000000000000000000000000000000",
    ],
  });

  return signer?.writeContract({
    abi: prizeTap721ABI,
    account: account as any,
    address: raffleContract.address,
    functionName: "createRaffle",
    args: [
      currencyAddress,
      nftIds.map(item => BigInt(item)),
      maxParticipants,
      1n,
      startTime,
      endTime,
      BigInt(nftIds.length),
      "0x0000000000000000000000000000000000000000000000000000000000000000",
    ],
    gasPrice: gasEstimate,
  });
};

export const createErc721Raffle = async (
  data: ProviderDashboardFormDataProp,
  provider: PublicClient,
  signer: GetWalletClientResult,
  requirementList: RequirementProps[],
  address: string,
  userToken: string,
  setCreateRaffleLoading: any,
  setCreteRaffleResponse: any
) => {
  const raffleContractAddress = data.selectedChain?.erc721PrizetapAddr;
  const maxNumberOfEntries = data.maxNumberOfEntries
    ? data.maxNumberOfEntries
    : "1000000000";
  const constraints = requirementList.map((item) => item.pk);
  const reversed_constraints = requirementList.filter(item => item.isNotSatisfy).map(ids => ids.pk);
  const prizeName = data.nftName;
  const twitter = data.twitter ? "https://twitter.com/" + data.twitter?.replace("@", "") : null;
	const discord = data.discord ? 'https://discord.com/' + data.discord.replace('@', '') : null;
	const telegram = data.telegram ? 'https://t.me/' + data.telegram.replace('@', '') : null;
	const creatorUrl = data.creatorUrl ? 'https://' + data.creatorUrl : null;

  if (!data.nftTokenIds) return;

  const raffleData = {
    name: prizeName,
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
		nftIds: data.nftTokenIds.length > 1 ?  data.nftTokenIds.join(',') : data.nftTokenIds[0],
    isPrizeNft: true,
    winnersCount: data.nftTokenIds.length,
    discord_url:discord,
		twitter_url:twitter,
		creator_url:creatorUrl,
		telegram_url: telegram,
    reversed_constraints: reversed_constraints.length > 1 ? reversed_constraints.join(',') : reversed_constraints.length == 1 ? reversed_constraints[0].toString() : undefined,
		email_url:data.email,
		necessary_information:data.necessaryInfo
  };

    
  const raffleContract: any = getContract({
    address: raffleContractAddress as any,
    abi: prizeTap721ABI,
    publicClient: provider,
  });



  try {
    setCreateRaffleLoading(true);
    const response = await createErc721RaffleCallback(
      address,
      raffleContract,
      signer,
      provider,
      data.nftContractAddress as any,
      data.nftTokenIds,
      BigInt(maxNumberOfEntries),
      data.startTimeStamp,
      data.endTimeStamp,
    );

      
  const raffle = await createRaffleApi(userToken, raffleData);

  if (!raffle.success) {
    return false;
  }

  const rafflePk = raffle.data.id;

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
