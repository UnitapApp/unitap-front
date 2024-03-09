"use client";

import { FC, useState, useMemo } from "react";
import { Token } from "@/types";
import Icon from "@/components/ui/Icon";
import Tooltip from "@/components/ui/Tooltip";
import { getChainIcon } from "@/utils/chain";
import { numberWithCommas } from "@/utils/numbers";
import styled from "styled-components/";
import { DV } from "@/components/ui/designVariables";
import {
  NoCurrencyButton,
  ClaimButton,
  ClaimedButton,
} from "@/components/ui/Button/button";
import { useWalletAccount } from "@/utils/wallet";
import { useTokenTapContext } from "@/context/tokenTapProvider";
import Markdown from "./Markdown";
import Image from "next/image";
import ClaimTokenButton from "./claimButton";

const TokenCard: FC<{ token: Token; isHighlighted?: boolean }> = ({
  token,
  isHighlighted,
}) => {
  const { openClaimModal, claimedTokensList, claimingTokenPk } =
    useTokenTapContext();

  const { isConnected, connector } = useWalletAccount();

  const [showAllPermissions, setShowAllPermissions] = useState(false);

  const onTokenClicked = () => {
    window.open(token.distributorUrl);
  };

  const collectedToken = useMemo(
    () =>
      claimedTokensList.find((item) => item.tokenDistribution.id === token.id),
    [claimedTokensList, token]
  );

  const calculateClaimAmount =
    token.chain.chainName === "Lightning"
      ? token.amount
      : token.amount / 10 ** token.chain.decimals;

  const timePermissionVerification = useMemo(
    () => token.constraints.find((permission) => permission.type === "TIME"),
    [token]
  );

  return (
    <article
      className={`token-card flex ${
        isHighlighted
          ? "before:!inset-[3px] p-0 gradient-outline-card mb-20"
          : "mb-4"
      } flex-col items-center justify-center w-full mb-4`}
    >
      <span className="flex flex-col w-full">
        <div
          className={`pt-4 pr-6 pl-3 ${
            isHighlighted ? "bg-g-primary-low" : "bg-[#161623]"
          } w-full flex flex-col md:flex-row gap-2 md:gap-0 justify-between items-center rounded-t-3xl`}
        >
          <div className="token-header rounded-l-full p-[2px]">
            <div
              // onClick={onTokenClicked}
              className="w-80 rounded-l-full bg-[#161623] items-start flex mb-6 sm:mb-0"
            >
              <span className="w-16 h-16 flex justify-center mr-3">
                <img
                  className="w-auto h-full"
                  src={
                    token.imageUrl ??
                    "/assets/images/token-tap/bright-token.svg"
                  }
                  alt="chain logo"
                />
              </span>
              <div className="w-max mt-2 ml-2">
                <p
                  className="text-white text-sm text-center md:text-left flex mb-2"
                  data-testid={`token-name-${token.id}`}
                >
                  {token.name}
                </p>
                <p className="text-xs text-white font-medium">
                  {token.distributor}
                </p>
              </div>
              <div className="flex mt-2 items-start">
                <a
                  className="mx-2 text-gray100 bg-[#1B1B29] text-2xs px-2 py-1 rounded-xl border border-bg06"
                  target="_blank"
                  rel="noreferrer"
                  href={token.twitterUrl}
                >
                  <Icon
                    className="cursor-pointer"
                    iconSrc="assets/images/token-tap/twitter-icon.svg"
                    width="auto"
                    height="13px"
                  />
                </a>
                <a
                  className="text-2xs text-gray100 bg-[#1B1B29] px-2 py-1 rounded-xl border border-bg06"
                  target="_blank"
                  rel="noreferrer"
                  href={token.discordUrl}
                >
                  <Icon
                    className="cursor-pointer"
                    iconSrc="assets/images/token-tap/discord-icon.svg"
                    width="auto"
                    height="13px"
                  />
                </a>
              </div>
            </div>
          </div>
          <div
            className={
              "flex items-center gap-2 justify-end flex-col md:flex-row !w-full sm:w-auto"
            }
          >
            <Action className={"w-full sm:w-auto items-center sm:items-end"}>
              <ClaimTokenButton
                isEmpty={token.isMaxedOut}
                isClaiming={
                  claimingTokenPk === token.id ||
                  (token.chain.chainName === "Lightning" &&
                    collectedToken?.status === "Pending")
                }
                isClaimed={collectedToken?.status === "Verified"}
                amount={calculateClaimAmount}
                symbol={token.token}
                disabled={token.isMaxedOut}
                onClick={() => openClaimModal(token)}
                tokenLogo={token.tokenImageUrl}
              />
            </Action>
          </div>
        </div>
        <Markdown isHighlighted={isHighlighted} content={token.notes} />
        <div
          className={`${
            isHighlighted ? "bg-g-primary-low" : "bg-[#161623]"
          } pl-6 md:pl-16 pr-6 text-justify pb-3 flex items-center flex-wrap text-xs gap-2 text-white`}
        >
          {(showAllPermissions
            ? token.constraints
            : token.constraints
                .filter((permission) => permission.type === "VER")
                .slice(0, 6)
          ).map((permission, key) => (
            <Tooltip
              className={
                "border-gray70 bg-gray50 hover:bg-gray10 transition-colors border px-3 py-2 rounded-lg "
              }
              data-testid={`token-verification-${token.id}-${permission.name}`}
              key={key}
              text={permission.description}
            >
              <div className="flex items-center gap-3">{permission.title}</div>
            </Tooltip>
          ))}

          {token.constraints.length > 6 && (
            <button
              onClick={setShowAllPermissions.bind(null, !showAllPermissions)}
              className="border-gray70 flex items-center z-10 bg-gray60 transition-colors border px-3 py-2 rounded-lg"
            >
              <span>{showAllPermissions ? "Show less" : "Show more"}</span>
              <Image
                alt="angle-down"
                width={12}
                height={7}
                src="/assets/images/token-tap/angle-down.svg"
                className={`ml-2 ${
                  showAllPermissions ? "rotate-180" : ""
                } transition-transform`}
              />
            </button>
          )}
        </div>
      </span>
      <div
        className={`${
          isHighlighted ? "bg-g-primary-low" : "bg-[#1B1B29]"
        } w-full gap-4 md:gap-0 items-center flex min-h-[48px] md:flex-row flex-col rounded-b-3xl px-4 pr-6 justify-between relative`}
      >
        <div className="flex gap-x-2 items-center mr-auto text-xs sm:text-sm">
          <div className="flex items-center gap-2">
            <span className="text-[#67677B]">Chain: </span>
            <span className="text-[#B5B5C6]">{token.chain.chainName}</span>
            <img
              src={
                token.chain.logoUrl ??
                "https://bafybeicyyzg3pak32msuuzwdldiybydlwzm7yqpuh6hjm7fp4pox7disbm.ipfs.w3s.link/100.svg"
              }
              className="w-4"
              alt={token.chain.chainName}
            />
          </div>
          <Icon
            iconSrc={getChainIcon(token.chain)}
            width="auto"
            height="16px"
          />
        </div>

        {!!timePermissionVerification && (
          <Tooltip
            className={`text-sm h-9 mr-auto mt-2 rounded-t-2xl px-1 !cursor-default py-3 w-52 self-end ${
              isHighlighted ? "bg-transparent" : "bg-bg00"
            }`}
            withoutImage
            text={timePermissionVerification.description}
          >
            <div
              data-testid={`token-verification-${token.id}-${timePermissionVerification.name}`}
              className="flex items-center justify-between px-3"
            >
              <span
                className={`${
                  timePermissionVerification.name ===
                  "tokenTap.OnceInALifeTimeVerification"
                    ? "text-[#689E7A]"
                    : "text-[#997EA4]"
                }`}
              >
                {timePermissionVerification.title}
              </span>
              <Icon
                width="20px"
                iconSrc={`/assets/images/token-tap/${
                  timePermissionVerification.name ===
                  "tokenTap.OnceInALifeTimeVerification"
                    ? "non-repeat.svg"
                    : "repeat.svg"
                }`}
              />
            </div>
          </Tooltip>
        )}
        <div className="mr-auto"></div>
      </div>
    </article>
  );
};

const Action = styled.div`
  display: flex;

  @media only screen and (max-width: ${DV.breakpoints.smallDesktop}) {
    flex-direction: column;
  }
`;

export default TokenCard;
