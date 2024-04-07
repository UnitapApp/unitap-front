import {
  RequirementProps,
  ProviderDashboardFormDataProp,
  Chain,
} from "@/types";
import { prizeTap721Abi } from "@/types/abis/contracts";
import { getContract, PublicClient } from "viem";
import { checkStartTimeStamp, deadline, startAt } from "./deadlineAndStartAt";
import { createRaffleApi, updateCreateRaffleTx } from "@/utils/api";
import { GetWalletClientReturnType } from "wagmi/actions";
import { GetContractReturnType } from "viem";
import { contractAddresses } from "@/constants";

export const createErc721RaffleCallback = async (
  account: string,
  raffleContract: GetContractReturnType,
  signer: GetWalletClientReturnType,
  provider: PublicClient,
  currencyAddress: `0x${string}`,
  nftIds: string[],
  maxParticipants: bigint,
  startTime: bigint,
  endTime: bigint,
  selectedChain: Chain,
) => {
  if (!provider || !signer) return;

  const gasEstimate = await provider.estimateContractGas({
    abi: prizeTap721Abi,
    account: account as any,
    address: raffleContract.address,
    functionName: "createRaffle",
    args: [
      currencyAddress,
      nftIds.map((item) => BigInt(item)),
      maxParticipants,
      1n,
      startTime,
      endTime,
      BigInt(nftIds.length),
      "0x0000000000000000000000000000000000000000000000000000000000000000",
    ],
  });
  if (selectedChain.chainId === "42161") {
    return signer?.writeContract({
      abi: prizeTap721Abi,
      account: account as any,
      address: raffleContract.address,
      functionName: "createRaffle",
      args: [
        currencyAddress,
        nftIds.map((item) => BigInt(item)),
        maxParticipants,
        1n,
        startTime,
        endTime,
        BigInt(nftIds.length),
        "0x0000000000000000000000000000000000000000000000000000000000000000",
      ],
      // gasPrice: gasEstimate,
    });
  }
  return signer?.writeContract({
    abi: prizeTap721Abi,
    account: account as any,
    address: raffleContract.address,
    functionName: "createRaffle",
    args: [
      currencyAddress,
      nftIds.map((item) => BigInt(item)),
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
  signer: GetWalletClientReturnType,
  requirementList: RequirementProps[],
  address: string,
  userToken: string,
  setCreateRaffleLoading: any,
  setCreteRaffleResponse: any,
) => {
  const raffleContractAddress = contractAddresses.prizeTapErc721;
  const maxNumberOfEntries = data.maxNumberOfEntries
    ? data.maxNumberOfEntries
    : "1000000000";
  const constraints = requirementList.map((item) => item.pk.toString());
  const reversed_constraints = requirementList
    .filter((item) => item.isNotSatisfy)
    .map((ids) => ids.pk);

  const constraintFileList: any = requirementList
    .filter((item) => item.constraintFile)
    .map((item) => item.constraintFile);

  const constraint_params = requirementList.reduce((obj: any, item: any) => {
    obj[item.name] = item.params;
    return obj;
  }, {});

  const prizeName = data.nftName;
  const twitter = data.twitter
    ? "https://twitter.com/" + data.twitter?.replace("@", "")
    : null;
  const discord = data.discord
    ? "https://discord.com/" + data.discord.replace("@", "")
    : null;
  const telegram = data.telegram
    ? "https://t.me/" + data.telegram.replace("@", "")
    : null;
  const creatorUrl = data.creatorUrl ? "https://" + data.creatorUrl : null;

  const reversed =
    reversed_constraints.length > 1
      ? reversed_constraints.join(",")
      : reversed_constraints.length == 1
        ? reversed_constraints[0].toString()
        : "";

  const nftIdsToString =
    data.nftTokenIds.length > 1
      ? data.nftTokenIds.join(",")
      : data.nftTokenIds[0];

  const formData = new FormData();

  if (!data.nftTokenIds) return;

  for (let i = 0; i < constraints.length; i++) {
    formData.append("constraints", constraints[i]);
  }

  if (constraintFileList) {
    for (let i = 0; i < constraintFileList.length; i++) {
      formData.append("constraint_files", constraintFileList[i]);
    }
  }

  if (reversed) {
    formData.append("reversed_constraints", reversed);
  }

  const startTime = checkStartTimeStamp(data.startTimeStamp);

  formData.append("name", prizeName!);
  formData.append("description", data.description ?? "");
  formData.append("contract", raffleContractAddress);
  formData.append("creator_name", data.provider!);
  formData.append("prize_amount", "1");
  formData.append("creator_address", address);
  formData.append("prize_asset", data.nftContractAddress);
  formData.append("prize_name", prizeName!);
  formData.append("prize_symbol", data.nftSymbol!);
  formData.append("chain", data.selectedChain.pk);
  formData.append("constraint_params", btoa(JSON.stringify(constraint_params)));
  formData.append("deadline", deadline(data.endTimeStamp));
  formData.append("max_number_of_entries", maxNumberOfEntries);
  formData.append("start_at", startAt(startTime));
  formData.append("nft_ids", nftIdsToString);
  formData.append("is_prize_nft", "true");
  formData.append("winners_count", data.nftTokenIds.length.toString());
  formData.append("discord_url", discord! ?? "");
  formData.append("twitter_url", twitter! ?? "");
  formData.append("creator_url", creatorUrl! ?? "");
  formData.append("telegram_url", telegram! ?? "");
  formData.append("email_url", data.email!);
  formData.append("necessary_information", data.necessaryInfo!);

  const raffleContract: any = getContract({
    address: raffleContractAddress as any,
    abi: prizeTap721Abi,
    client: provider,
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
      BigInt(startTime),
      data.endTimeStamp,
      data.selectedChain,
    );

    if (!response) throw new Error("Contract hash not found");

    const transactionInfo = await provider.waitForTransactionReceipt({
      hash: response,
      confirmations: 1,
    });

    const raffle = await createRaffleApi(userToken, formData);

    if (!raffle.success) {
      return false;
    }

    const rafflePk = raffle.data.id;

    setCreteRaffleResponse({
      success: true,
      state: "Done",
      txHash: transactionInfo.transactionHash,
      message: "Created raffle successfully.",
    });

    setCreateRaffleLoading(false);

    await updateCreateRaffleTx(
      userToken,
      rafflePk,
      transactionInfo.transactionHash,
    );
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
