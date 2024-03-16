"use client";

import { FC, useState, useMemo, Fragment } from "react";
import { Token } from "@/types";
import Icon from "@/components/ui/Icon";
import Tooltip from "@/components/ui/Tooltip";
import { getChainIcon } from "@/utils/chain";
import styled from "styled-components/";
import { DV } from "@/components/ui/designVariables";
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
    [claimedTokensList, token],
  );

  const calculateClaimAmount =
    token.chain.chainName === "Lightning"
      ? token.amount
      : token.amount / 10 ** token.chain.decimals;

  const timePermissionVerification = useMemo(
    () => token.constraints.find((permission) => permission.type === "TIME"),
    [token],
  );

  const verificationsList = showAllPermissions
    ? token.constraints.filter((permission) => permission.type === "VER")
    : token.constraints
        .filter((permission) => permission.type === "VER")
        .slice(0, 10);

  return (
    <article
      className={`token-card flex ${
        isHighlighted
          ? "gradient-outline-card mb-20 p-0 before:!inset-[3px]"
          : "mb-4"
      } mb-4 w-full flex-col items-center justify-center`}
    >
      <span className="flex w-full flex-col">
        <div
          className={`pl-3 pr-6 pt-4 ${
            isHighlighted ? "bg-g-primary-low" : "bg-[#161623]"
          } flex w-full flex-col items-center justify-between gap-2 rounded-t-3xl md:flex-row md:gap-0`}
        >
          <div className="token-header mb-6 rounded-l-full p-[2px] sm:mb-0">
            <div
              // onClick={onTokenClicked}
              className="flex w-80 items-start rounded-l-full bg-[#161623] "
            >
              <span className="mr-3 flex h-16 w-16 justify-center">
                <img
                  className="h-full w-auto"
                  src={
                    token.imageUrl ??
                    "/assets/images/token-tap/bright-token.svg"
                  }
                  alt="chain logo"
                />
              </span>
              <div className="ml-2 mt-2 w-max">
                <p
                  className="mb-2 flex text-center text-sm text-white md:text-left"
                  data-testid={`token-name-${token.id}`}
                >
                  {token.name}
                </p>
                <p className="text-xs font-medium text-white">
                  {token.distributor}
                </p>
              </div>
              <div className="mt-2 flex items-start">
                <a
                  className="mx-2 rounded-xl border border-bg06 bg-[#1B1B29] px-2 py-1 text-2xs text-gray100"
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
                  className="rounded-xl border border-bg06 bg-[#1B1B29] px-2 py-1 text-2xs text-gray100"
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
              "flex !w-full flex-col items-center justify-end gap-2 sm:w-auto md:flex-row"
            }
          >
            <Action className={"w-full items-center sm:w-auto sm:items-end"}>
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
          }  pb-3 pr-6 text-justify text-[#B5B5C6]`}
        >
          <div className="constraints-wrapper relative flex flex-wrap items-center gap-2 rounded-2xl pl-4 text-xs">
            {verificationsList.map((permission, key) => (
              <div key={key}>
                <span className="text-lg text-[#D9D9D9]">
                  {key === 0 || "|"}
                </span>
                <Tooltip
                  className={"rounded-lg px-3 py-3 "}
                  data-testid={`token-verification-${token.id}-${permission.name}`}
                  text={permission.description}
                >
                  <div className="flex items-center gap-3">
                    {permission.title}
                  </div>
                </Tooltip>
              </div>
            ))}

            {token.constraints.length > 2 && (
              <button
                onClick={setShowAllPermissions.bind(null, !showAllPermissions)}
                className={`collapse-handler absolute bottom-0 right-0 top-0 z-10 ml-auto flex items-center rounded-r-2xl px-3 py-4`}
              >
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
        </div>
      </span>
      <div
        className={`${
          isHighlighted ? "bg-g-primary-low" : "bg-[#1B1B29]"
        } relative flex min-h-[48px] w-full flex-col items-center justify-between gap-4 rounded-b-3xl px-4 pr-6 md:flex-row md:gap-0`}
      >
        <div className="mr-auto flex items-center gap-x-2 text-xs sm:text-sm">
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
        </div>

        {!!timePermissionVerification && (
          <Tooltip
            className={`mr-auto mt-2 h-9 w-52 !cursor-default self-end rounded-t-2xl px-1 py-3 text-sm ${
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
