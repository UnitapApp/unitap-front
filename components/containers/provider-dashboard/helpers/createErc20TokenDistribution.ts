import {
  ProviderDashboardFormDataProp,
  RequirementProps,
} from "@/types/provider-dashboard";
import {
  Address,
  TransactionReceiptNotFoundError,
  parseEther,
  zeroAddress,
} from "viem";
import { GetWalletClientResult } from "wagmi/dist/actions";
import { deadline, startAt } from "./deadlineAndStartAt";
import { toWei } from "@/utils";
import { createTokenDistribution } from "@/utils/api";
import { estimateGas } from "@/utils/wallet";
import { PublicClient, erc20ABI } from "wagmi";
import { tokenTapABI } from "@/types/abis/contracts";
import Big from "big.js";
import { contractAddresses } from "@/constants";

const txCallBack = async (
  address: string,
  signer: GetWalletClientResult,
  provider: PublicClient,
  decimals: number,
  tokenContractAddress: string,
  maxNumClaim: bigint,
  tokenAmount: string,
  totalAmount: string,
  startTime: bigint,
  endTime: bigint,
  isNativeToken: boolean
) => {
  const gasEstimate = await provider.estimateContractGas({
    abi: tokenTapABI,
    account: address as any,
    address: contractAddresses.tokenTap as any,
    functionName: "distributeToken",
    args: [
      tokenContractAddress as any,
      maxNumClaim,
      isNativeToken
        ? parseEther(new Big(tokenAmount).toFixed())
        : BigInt(toWei(Number(new Big(tokenAmount).toFixed()), decimals)),
      startTime,
      endTime,
    ],
    value: tokenContractAddress == zeroAddress ? parseEther(totalAmount) : 0n,
  });

  return signer?.writeContract({
    abi: tokenTapABI,
    account: address as any,
    address: contractAddresses.tokenTap as any,
    functionName: "distributeToken",
    gasPrice: gasEstimate,
    args: [
      tokenContractAddress as any,
      maxNumClaim,
      isNativeToken
        ? parseEther(new Big(tokenAmount).toFixed())
        : BigInt(toWei(Number(new Big(tokenAmount).toFixed()), decimals)),
      startTime,
      endTime,
    ],
    value: tokenContractAddress == zeroAddress ? parseEther(totalAmount) : 0n,
  });
};

export const createErc20TokenDistribution = async (
  data: ProviderDashboardFormDataProp,
  provider: PublicClient,
  signer: GetWalletClientResult,
  requirementList: RequirementProps[],
  address: string,
  userToken: string,
  setCreateRaffleLoading: any,
  setCreteRaffleResponse: any
) => {
  // const raffleContractAddress = data.selectedChain?.erc20PrizetapAddr;
  const maxNumberOfEntries = data.maxNumberOfEntries
    ? data.maxNumberOfEntries
    : "1000000000";
  const prizeName = data.isNativeToken
    ? data.selectedChain.symbol
    : data.tokenSymbol;

  const maxNumClaim = data.winnersCount.toString();
  // const prizeSymbol = data.isNativeToken
  // 	? data.selectedChain.symbol
  // 	: data.tokenSymbol;
  const decimals = data.isNativeToken ? 18 : data.tokenDecimals;
  const prizeAmount = toWei(
    data.tokenAmount,
    data.isNativeToken ? 18 : data.tokenDecimals
  );
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

  const token = data.isNativeToken ? zeroAddress : data.tokenContractAddress;
  const startTime = startAt(data.startTimeStamp);
  const endTime = deadline(data.endTimeStamp);

  const formData = new FormData();

  const reversed =
    reversed_constraints.length > 1
      ? reversed_constraints.join(",")
      : reversed_constraints.length == 1
      ? reversed_constraints[0].toString()
      : "";

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

  formData.append("name", prizeName);
  formData.append("distributor", data.provider!);
  formData.append("distributor_address", address);
  formData.append("distributor_url", creatorUrl! ?? "");
  formData.append("discord_url", discord! ?? "");
  formData.append("twitter_url", twitter! ?? "");
  formData.append("constraint_params", btoa(JSON.stringify(constraint_params)));
  formData.append("email_url", data.email!);
  formData.append("telegram_url", telegram! ?? "");
  formData.append("token", prizeName);
  formData.append("token_address", data.tokenContractAddress);
  formData.append("amount", prizeAmount.toString());
  formData.append("chain", data.selectedChain.pk);
  formData.append("contract", contractAddresses.tokenTap as any);
  formData.append("start_at", startTime);
  formData.append("deadline", endTime);
  formData.append("max_number_of_claims", maxNumClaim);
  formData.append("notes", data.description! ?? "");
  formData.append("necessary_information", data.necessaryInfo! ?? "");
  formData.append("decimals", decimals);

  try {
    setCreateRaffleLoading(true);
    const response = await txCallBack(
      address,
      signer,
      provider,
      decimals,
      token,
      BigInt(maxNumClaim),
      data.tokenAmount,
      data.totalAmount,
      data.startTimeStamp,
      data.endTimeStamp,
      data.isNativeToken
    );

    if (!response) throw new Error("Contract hash not found");

    const transactionInfo = await provider.waitForTransactionReceipt({
      hash: response,
      confirmations: 1,
    });

    formData.append("tx_hash", transactionInfo.transactionHash);

    const raffle = await createTokenDistribution(userToken, formData);
    if (!raffle.success) {
      return false;
    }
    setCreteRaffleResponse({
      success: true,
      state: "Done",
      txHash: transactionInfo.transactionHash,
      message: "Created distribution successfully.",
    });
    setCreateRaffleLoading(false);
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
