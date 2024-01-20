import { ProviderDashboardFormDataProp, RequirementProps } from "@/types/provider-dashboard";
import { PublicClient, getContract, parseEther } from "viem";
import { GetWalletClientResult} from "wagmi/dist/actions";
import { deadline, startAt } from "./deadlineAndStartAt";
import { toWei } from "@/utils";
import { createTokenDistribution } from "@/utils/api";
import { estimateGas } from "@/utils/wallet";


export const createErc20TokenDistribution = async (  data: ProviderDashboardFormDataProp,
  provider: PublicClient,
  signer: GetWalletClientResult,
  requirementList: RequirementProps[],
  address: string,
  userToken: string,
  setCreateRaffleLoading: any,
  setCreteRaffleResponse: any) => {
		// const raffleContractAddress = data.selectedChain?.erc20PrizetapAddr;
		const maxNumberOfEntries = data.maxNumberOfEntries
			? data.maxNumberOfEntries
			: "1000000000";
		const prizeName = data.isNativeToken
			?  data.selectedChain.symbol
			:  data.tokenSymbol;
		// const prizeSymbol = data.isNativeToken
		// 	? data.selectedChain.symbol
		// 	: data.tokenSymbol;
		// const decimals = data.isNativeToken ? 18 : data.tokenDecimals;
		const prizeAmount = toWei(
			data.tokenAmount,
			data.isNativeToken ? 18 : data.tokenDecimals
		);
		const twitter = data.twitter ? "https://twitter.com/" + data.twitter?.replace("@", "") : null;
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
		
		const distributionData = {
			name: prizeName,
			distributor: data.provider,
			distributor_address: address,
			distributor_url: creatorUrl,
			discord_url: discord,
			twitter_url: twitter,
			email_url: data.email,
			telegram_url: telegram,
			token: prizeName,
			tokenAddress: data.tokenContractAddress,
			amount: prizeAmount,
			chain: data.selectedChain.pk,
			contract: '0x3a798714Af3dB4E2517cf122d5Cd7B18599f5dBC',
			constraint_params: btoa(JSON.stringify(constraint_params.length > 0 ? constraint_params[0] : {})),
			constraints,
			reversed_constraints: reversed_constraints.length > 1 ? reversed_constraints.join(',') : reversed_constraints.length == 1 ? reversed_constraints[0].toString() : undefined,
			start_at: startAt(data.startTimeStamp),
			deadline: deadline(data.endTimeStamp),
			max_number_of_claims: maxNumberOfEntries,
			notes: data.description,
			necessary_information: data.necessaryInfo,
			// prize_symbol: prizeSymbol,
			// decimals: decimals,
			// winnersCount: data.winnersCount,
		};

	
		try {
			setCreateRaffleLoading(true);

			const raffle = await createTokenDistribution(userToken, distributionData);

			console.log(BigInt(parseEther(data.tokenAmount)))
			let tx = {
				to: "0x3a798714Af3dB4E2517cf122d5Cd7B18599f5dBC" as any,
				value: BigInt(parseEther(data.tokenAmount)
				),
			};


			const estimatedGas = await estimateGas(provider, {
				from: address,
				to: "0x3a798714Af3dB4E2517cf122d5Cd7B18599f5dBC",
				value: BigInt(tx.value),
			}).catch((err: any) => {
				return err;
			});

			
			const hash = await signer?.sendTransaction(
				{ ...tx,
					...(estimatedGas ? { gasLimit: estimatedGas } : {}),
				}
			).then(async (tx) => {
        await provider.waitForTransactionReceipt({
          hash: tx,
          confirmations: 1,
        });
        return tx;
      })

			console.log(hash)
			
			// if (!raffle.success) {
			// 	return false;
			// }
	
			// const rafflePk = raffle.data.id;
	
			setCreteRaffleResponse({
				success: true,
				state: "Done",
				txHash: hash,
				message: "Created raffle successfully.",
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
	