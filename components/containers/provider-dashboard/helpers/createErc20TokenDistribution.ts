import {
  ProviderDashboardFormDataProp,
  RequirementProps,
} from "@/types/provider-dashboard";
import { TransactionReceiptNotFoundError, parseEther } from "viem";
import { GetWalletClientResult } from "wagmi/dist/actions";
import { deadline, startAt } from "./deadlineAndStartAt";
import { toWei } from "@/utils";
import { createTokenDistribution } from "@/utils/api";
import { estimateGas } from "@/utils/wallet";
import { PublicClient, erc20ABI } from "wagmi";

const txCallBack = async (
  address: string,
  signer: GetWalletClientResult,
  provider: PublicClient,
  decimals: number,
  tokenContractAddress: string,
  totalAmount: string
) => {
  const gasEstimate = await provider.estimateContractGas({
    abi: erc20ABI,
    account: address as any,
    address: tokenContractAddress as any,
    functionName: "transfer",
    args: [
      "0x3a798714Af3dB4E2517cf122d5Cd7B18599f5dBC",
      parseEther(totalAmount),
    ],
  });

  return signer?.writeContract({
    abi: erc20ABI,
    account: address as any,
    address: tokenContractAddress as any,
    functionName: "transfer",
    gasPrice: gasEstimate,
    args: [
      "0x3a798714Af3dB4E2517cf122d5Cd7B18599f5dBC",
      BigInt(toWei(totalAmount, decimals)),
    ],
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
  formData.append("contract", "0x3a798714Af3dB4E2517cf122d5Cd7B18599f5dBC");
  formData.append("start_at", startAt(data.startTimeStamp));
  formData.append("deadline", deadline(data.endTimeStamp));
  formData.append("max_number_of_claims", data.winnersCount.toString());
  formData.append("notes", data.description! ?? "");
  formData.append("necessary_information", data.necessaryInfo! ?? "");

  try {
    setCreateRaffleLoading(true);

    if (data.isNativeToken) {
      let tx = {
        to: "0x3a798714Af3dB4E2517cf122d5Cd7B18599f5dBC" as any,
        value: BigInt(parseEther(data.totalAmount)),
      };
      const estimatedGas: any = await estimateGas(provider, {
        from: address,
        to: "0x3a798714Af3dB4E2517cf122d5Cd7B18599f5dBC",
        value: BigInt(tx.value),
      }).catch((err: any) => {
        return err;
      });

      const hash = await signer
        ?.sendTransaction({
          ...tx,
          ...(estimatedGas ? { gasLimit: estimatedGas } : {}),
        })
        .then(async (tx) => {
          await provider.waitForTransactionReceipt({
            hash: tx,
            confirmations: 1,
          });
          return tx;
        });

      const raffle = await createTokenDistribution(userToken, formData);
      if (!raffle.success) {
        return false;
      }
      setCreteRaffleResponse({
        success: true,
        state: "Done",
        txHash: hash,
        message: "Created distribution successfully.",
      });
      setCreateRaffleLoading(false);
    } else {
      const response = await txCallBack(
        address,
        signer,
        provider,
        decimals,
        data.tokenContractAddress as any,
        data.totalAmount
      );

      if (!response) throw new Error("Contract hash not found");

      const transactionInfo = await provider.waitForTransactionReceipt({
        hash: response,
        confirmations: 1,
      });

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
    }
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
