// import { Chain, ProviderDashboardFormDataProp } from "@/types";
// import { fromWei, toWei } from "@/utils/numbersBigNumber";
// import {
//   GetContractReturnType,
//   PublicClient,
//   getContract,
//   Address,
//   erc20Abi,
// } from "viem";

// import { prizeTapAbi } from "@/types/abis/contracts";

// import { GetWalletClientReturnType } from "wagmi/actions";

// export const refundRemainingPrizeCallback = async (
//   address: Address,
//   erc20Contract: GetContractReturnType,
//   provider: PublicClient,
//   signer: GetWalletClientReturnType,
//   selectedChain: Chain,
// ) => {
//   const response = await signer?.writeContract({
//     abi: prizeTapAbi,
//     address: erc20Contract.address,
//     account: address,
//     functionName: "refundRemainingPrizes",
//     args: [],
//   });

//   if (!response) return;

//   await provider.waitForTransactionReceipt({
//     hash: response,
//     confirmations: 1,
//   });

//   return {
//     hash: response,
//   };
// };

// export const refundRemainingPrize = async (
//   data: ProviderDashboardFormDataProp,
//   provider: PublicClient,
//   signer: GetWalletClientReturnType,
//   address: Address,
//   selectedChain: Chain,
// ) => {
//   if (!provider || !signer) return;
//   const contract = getContract({
//     abi: prizeTapAbi,
//     address: data.tokenContractAddress as Address,
//     client: provider,
//   });

//   try {
//     const response = await refundRemainingPrizeCallback(
//       address,
//       contract,
//       provider,
//       signer,
//       selectedChain,
//     );
//     return response;
//   } catch (e: any) {
//     console.log(e);
//   }
// };
