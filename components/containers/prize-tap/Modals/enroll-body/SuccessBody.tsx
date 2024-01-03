"use client";

import { Prize } from "@/types";
import { FC } from "react";
import { Text } from "@/components/ui/text.style";
import { getTxUrl } from "@/utils";
import { usePrizeTapContext } from "@/context/prizeTapProvider";
import Icon from "@/components/ui/Icon";
import Styles from "../../../provider-dashboard/prize-tap/content.module.scss";

const SuccessBody: FC<{
  raffle: Prize;
  method: string;
}> = ({ raffle, method }) => {
  const calculateClaimAmount = raffle.prizeAmount / 10 ** raffle.decimals;

  const { claimOrEnrollWalletResponse } = usePrizeTapContext();

  const handleShareClaimTwitter = () => {
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
      `I won ${raffle.name} from @Unitap_app among ${
        raffle.numberOfOnchainEntries
      } participants. 🤩🎉 (raffled off by @${raffle.twitterUrl
        .split("/")
        .at(-1)}) 
				Try your luck to win valuable prizes at `
    )}&url=${encodeURIComponent("unitap.app/prize-tap")}`;
    window.open(twitterUrl, "_blank");
  };

  const handleShareEnrollTwitter = () => {
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
      `Trying my chances to win ${
        raffle.name
      } at @unitap_app (raffled off by @${raffle.twitterUrl
        .split("/")
        .at(-1)}) 💚💜
					Feeling lucky? 😎 `
    )}&url=${encodeURIComponent("unitap.app/prize-tap")}`;
    window.open(twitterUrl, "_blank");
  };

  return (
    <>
      {method === "Claim" ? (
        <div>
          <div className={Styles["prize-success-stroke"]}>
            {!raffle.isPrizeNft ? (
              <h1
                data-heading={calculateClaimAmount + " " + raffle.prizeSymbol}
              >
                {calculateClaimAmount} {raffle.prizeSymbol}
              </h1>
            ) : (
              <h1 data-heading={raffle.prizeName}> {raffle.prizeName} </h1>
            )}
          </div>

          <span className="flex justify-center items-center font-medium mb-3">
            {!raffle.isPrizeNft ? (
              <Text
                className="!mb-0"
                width="100%"
                fontSize="14"
                color="space_green"
                $textAlign="center"
              >
                {calculateClaimAmount} {raffle.prizeSymbol} Claimed
              </Text>
            ) : (
              <Text
                className="!mb-0"
                width="100%"
                fontSize="14"
                color="space_green"
                $textAlign="center"
              >
                {raffle.prizeName} Claimed
              </Text>
            )}
          </span>

          <span className="flex justify-center items-center font-medium mb-3">
            <Text
              className="!mb-8"
              color="gray100"
              width="100%"
              fontSize="14"
              $textAlign="center"
            >
              Congratulations, @{raffle.userEntry?.userProfile?.username} on
              your grand prize win!
            </Text>
          </span>

          <Text
            width="100%"
            fontSize="14"
            color="second_gray_light"
            className="underline cursor-pointer"
            mb={3}
            $textAlign="center"
            onClick={() =>
              window.open(
                getTxUrl(raffle.chain, claimOrEnrollWalletResponse!.txHash!),
                "_blank"
              )
            }
          >
            view on explorer
          </Text>
          <div className="relative w-full">
            <button
              onClick={handleShareClaimTwitter}
              className={`gradient-outline-twitter-button w-full flex items-center justify-center bg-gray00 transition-all duration-75 hover:bg-gray20 rounded-xl border-gray00 px-3 py-4`}
            >
              <p className="text-sm font-semibold text-twitter">
                Share on Twitter
              </p>
            </button>
            <Icon
              iconSrc="/assets/images/gas-tap/twitter-share.svg"
              className="w-6 h-6 absolute right-4 top-1/2 z-10 pointer-events-none -translate-y-1/2"
              width="auto"
              height="26px"
            />
          </div>
        </div>
      ) : (
        <>
          <span className="flex justify-center items-center font-medium mb-3">
            <Text
              className="!mb-0"
              width="100%"
              fontSize="14"
              color="space_green"
              $textAlign="center"
            >
              successfully enrolled in {raffle.name} raffle
            </Text>
            <Icon
              iconSrc="assets/images/modal/successful-state-check.svg"
              width="22px"
              height="auto"
              className="ml-2"
            />
          </span>

          <Text
            width="100%"
            fontSize="14"
            color="second_gray_light"
            className="underline cursor-pointer"
            mb={3}
            $textAlign="center"
            onClick={() =>
              window.open(
                getTxUrl(raffle.chain, claimOrEnrollWalletResponse!.txHash!),
                "_blank"
              )
            }
          >
            view on explorer
          </Text>

          <div className="relative w-full">
            <button
              onClick={handleShareEnrollTwitter}
              className={`gradient-outline-twitter-button w-full flex items-center justify-center bg-gray00 transition-all duration-75 hover:bg-gray20 rounded-xl border-gray00 px-3 py-4`}
            >
              <p className="text-sm font-semibold text-twitter">
                Share on Twitter
              </p>
            </button>
            <Icon
              iconSrc="/assets/images/gas-tap/twitter-share.svg"
              className="w-6 h-6 absolute right-4 top-1/2 z-10 pointer-events-none -translate-y-1/2"
              width="auto"
              height="26px"
            />
          </div>
        </>
      )}
    </>
  );
};

export default SuccessBody;
