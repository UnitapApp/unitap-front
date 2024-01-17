import { ZERO_ADDRESS } from "@/constants";
import { ProviderDashboardFormDataProp, RequirementProps } from "@/types";
import { prizeTapABI } from "@/types/abis/contracts";
import { toWei } from "@/utils/numbersBigNumber";
import { PublicClient, getContract, parseEther } from "viem";
import { GetContractResult, GetWalletClientResult } from "wagmi/dist/actions";
import { deadline, startAt } from "./deadlineAndStartAt";
import { createRaffleApi, updateCreateRaffleTx } from "@/utils/api";
import Big from "big.js";

const createErc20RaffleCallback = async (
  account: string,
  raffleContract: GetContractResult,
  signer: GetWalletClientResult,
  provider: PublicClient,
  payableAmount: string,
  tokenDecimals: number,
  currencyAddress: `0x${string}`,
  maxParticipants: bigint,
  startTime: bigint,
  endTime: bigint,
  isNativeToken: boolean,
  winnersCount: bigint,
  totalAmount:  string
) => {
  if (!provider || !signer) return;
  const gasEstimate = await provider.estimateContractGas({
    abi: prizeTapABI,
    account: account as any,
    address: raffleContract.address,
    functionName: "createRaffle",
    args: [
      isNativeToken
        ? parseEther(new Big(payableAmount).toFixed())
        : BigInt(toWei((Number(new Big(payableAmount).toFixed())), tokenDecimals)),
      currencyAddress,
      maxParticipants,
      1n,
      startTime,
      endTime,
      winnersCount,
      "0x0000000000000000000000000000000000000000000000000000000000000000",
    ],
    value: currencyAddress == ZERO_ADDRESS ? parseEther(totalAmount): 0n,
  });

  return signer?.writeContract({
    abi: prizeTapABI,
    account: account as any,
    address: raffleContract.address,
    functionName: "createRaffle",
    gasPrice: gasEstimate,
    args: [
      isNativeToken
      ? parseEther(new Big(payableAmount).toFixed())
      : BigInt(toWei((Number(new Big(payableAmount).toFixed())), tokenDecimals)),
      currencyAddress,
      maxParticipants,
      1n,
      startTime,
      endTime,
      winnersCount,
      "0x0000000000000000000000000000000000000000000000000000000000000000",
    ],
    value: currencyAddress == ZERO_ADDRESS ? parseEther(totalAmount) : 0n,
  });
};

export const createErc20Raffle = async (
  data: ProviderDashboardFormDataProp,
  provider: PublicClient,
  signer: GetWalletClientResult,
  requirementList: RequirementProps[],
  address: string,
  userToken: string,
  setCreateRaffleLoading: any,
  setCreteRaffleResponse: any
) => {
  const raffleContractAddress = data.selectedChain?.erc20PrizetapAddr;
  const maxNumberOfEntries = data.maxNumberOfEntries
    ? data.maxNumberOfEntries
    : "1000000000";
  const prizeName = data.isNativeToken
    ? data.tokenAmount + " " + data.selectedChain.symbol
    : data.tokenAmount + " " + data.tokenSymbol;
  const prizeSymbol = data.isNativeToken
    ? data.selectedChain.symbol
    : data.tokenSymbol;
  const decimals = data.isNativeToken ? 18 : data.tokenDecimals;
  const prizeAmount = toWei(
    data.tokenAmount,
    data.isNativeToken ? 18 : data.tokenDecimals
  );
  const twitter = "https://twitter.com/" + data.twitter?.replace("@", "");
  const discord = data.discord
    ? "https://discord.com/" + data.discord.replace("@", "")
    : null;
  const telegram = data.telegram
    ? "https://t.me/" + data.telegram.replace("@", "")
    : null;
  const creatorUrl = data.creatorUrl ? "https://" + data.creatorUrl : null;
  const constraints = requirementList.map((item) => item.pk);
  const reversed_constraints = requirementList.filter(item => item.isNotSatisfy).map(ids => ids.pk);
  const constraint_params = requirementList.filter(item => item.params ).map(item => ({[item.name]: item.params}));
  const raffleData = {
    name: prizeName,
    description: data.description,
    contract: raffleContractAddress,
    creator_name: data.provider,
    creator_address: address,
    prize_amount: prizeAmount,
    prize_asset: data.tokenContractAddress,
    prize_name: prizeName,
    prize_symbol: prizeSymbol,
    decimals: decimals,
    chain: Number(data.selectedChain.pk),
    constraints,
    constraint_params: btoa(JSON.stringify(constraint_params.length > 0 ? constraint_params[0] : {})),
    deadline: deadline(data.endTimeStamp),
    max_number_of_entries: maxNumberOfEntries,
    start_at: startAt(data.startTimeStamp),
    winnersCount: data.winnersCount,
    discord_url: discord,
    twitter_url: twitter,
    creator_url: creatorUrl,
    telegram_url: telegram,
    reversed_constraints: reversed_constraints.length > 1 ? reversed_constraints.join(',') : reversed_constraints.length == 1 ? reversed_constraints[0].toString() : undefined,
    email_url: data.email,
    necessary_information: data.necessaryInfo,
  };

  const raffleContract: any = getContract({
    address: raffleContractAddress as any,
    abi: prizeTapABI,
    publicClient: provider,
  });



  try {
    setCreateRaffleLoading(true);

    const response = await createErc20RaffleCallback(
      address,
      raffleContract,
      signer,
      provider,
      data.tokenAmount,
      decimals,
      data.tokenContractAddress as any,
      BigInt(maxNumberOfEntries),
      data.startTimeStamp,
      data.endTimeStamp,
      data.isNativeToken,
      BigInt(data.winnersCount),
      data.totalAmount
    );

    if (!response) throw new Error("Contract hash not found");

    const transactionInfo = await provider.waitForTransactionReceipt({
      hash: response,
      confirmations: 1,
    });

    const raffle = await createRaffleApi(userToken, raffleData);

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
    updateCreateRaffleTx(userToken, rafflePk, transactionInfo.transactionHash);
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
