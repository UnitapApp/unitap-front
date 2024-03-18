"use client";

import { FC, useEffect, useMemo, useState } from "react";
import { Prize } from "@/types";
import Icon from "@/components/ui/Icon";
import {
  ClaimAndEnrollButton,
  ClaimPrizeButton,
  EnrolledButton,
} from "@/components/ui/Button/button";
import styled from "styled-components";
import { DV } from "@/components/ui/designVariables";
import Tooltip from "@/components/ui/Tooltip";
import { numberWithCommas } from "@/utils/numbers";
import { LineaRaffleCard } from "./Linea";
import { usePrizeTapContext } from "@/context/prizeTapProvider";
import { useSearchParams } from "next/navigation";
import { useUserProfileContext } from "@/context/userProfile";
import Image from "next/image";
import { FAST_INTERVAL, LINEA_RAFFLE_PK } from "@/constants";
import { getAssetUrl, replacePlaceholders, shortenAddress } from "@/utils";

import { zeroAddress } from "viem";
import { useFastRefresh, useRefreshWithInitial } from "@/utils/hooks/refresh";
import ReactMarkdown from "react-markdown";
import Markdown from "@/app/tokentap/components/Markdown";

export const Action = styled.div`
  display: flex;

  @media only screen and (max-width: ${DV.breakpoints.smallDesktop}) {
    flex-direction: column;
  }
`;

const RafflesList = () => {
  const params = useSearchParams();
  const { rafflesList } = usePrizeTapContext();
  const [highlightedPrize, setHighlightedPrize] = useState("");

  const prizesSortListMemo = useMemo(
    () =>
      rafflesList.sort((a, b) => {
        const lowerHighlightChainName = highlightedPrize.toLowerCase();

        if (a.name.toLowerCase() === lowerHighlightChainName) return -1;
        if (b.name.toLowerCase() === lowerHighlightChainName) return 1;

        return 0;
      }),
    [rafflesList, highlightedPrize],
  );

  useEffect(() => {
    const highlightedPrize = params.get("icebox");

    setHighlightedPrize(highlightedPrize || "");
  }, [params, setHighlightedPrize]);

  return (
    <div className="wrap mb-4 grid w-full gap-4 md:flex-row">
      {!!prizesSortListMemo.length && (
        <div>
          <RaffleCardWrapper
            raffle={prizesSortListMemo[0]}
            isHighlighted={
              highlightedPrize.toLocaleLowerCase() ===
              rafflesList[0].name.toLocaleLowerCase()
            }
          />
        </div>
      )}

      {prizesSortListMemo.slice(1).map((rafflesList, index) => (
        <div key={index}>
          <RaffleCardWrapper key={rafflesList.pk} raffle={rafflesList} />
        </div>
      ))}
    </div>
  );
};

const RaffleCardWrapper: FC<{ raffle: Prize; isHighlighted?: boolean }> = (
  props,
) => {
  if (props.raffle.pk === LINEA_RAFFLE_PK)
    return <LineaRaffleCard {...props} />;

  return <RaffleCard {...props} />;
};

const RaffleCard: FC<{ raffle: Prize; isHighlighted?: boolean }> = ({
  raffle,
  isHighlighted,
}) => {
  const {
    imageUrl,
    tokenUri,
    creatorUrl,
    twitterUrl,
    discordUrl,
    creatorName,
    description,
    startAt,
    deadline,
    name,
    prizeName,
    chain,
    isExpired,
    numberOfOnchainEntries,
    maxNumberOfEntries,
    isPrizeNft,
    userEntry,
    prizeSymbol,
    decimals,
    prizeAmount,
    creatorProfile,
    winnerEntries: winnersEntry,
    winnersCount,
    status,
  } = raffle;

  const isRaffleEnd = new Date(deadline) < new Date();
  const params = useMemo(
    () => JSON.parse(raffle.constraintParams),
    [raffle.constraintParams],
  );
  const creator = creatorName || creatorProfile?.username;

  const { openEnrollModal } = usePrizeTapContext();
  const { userProfile } = useUserProfileContext();
  const remainingPeople = maxNumberOfEntries - numberOfOnchainEntries;
  const isRemainingPercentLessThanTen =
    remainingPeople < (maxNumberOfEntries / 100) * 10;
  const start = new Date(startAt) < new Date();
  const [showAllPermissions, setShowAllPermissions] = useState(false);

  const userClaimEntry = useMemo(
    () => winnersEntry?.find((item) => item.userProfile.pk === userProfile?.pk),
    [userProfile, winnersEntry],
  );

  // let tokenImgLink: string | undefined = tokenUri
  //   ? `https://ipfs.io/ipfs/QmYmSSQMHaKBByB3PcZeTWesBbp3QYJswMFZYdXs1H3rgA/${
  //       Number(tokenUri.split("/")[3]) + 1
  //     }.png`
  //   : undefined;

  const prizeLink = getAssetUrl(chain, raffle.prizeAsset!);

  const onPrizeClick = () => {
    if (raffle.prizeAsset == zeroAddress) return;
    if (prizeLink) window.open(prizeLink, "_blank");
  };

  return (
    <div>
      <div className="mb-5 min-h-[227px] overflow-hidden rounded-[28px]">
        <div className={`flex min-h-[187px] bg-gray20 `}>
          <div className="raffle-border relative rounded-tl-3xl p-[1px]">
            <div className="h-full rounded-tl-[29px] bg-gray20">
              <div
                className={`left-side relative h-full min-w-[320px] overflow-hidden rounded-tl-[29px] ${
                  isPrizeNft ? "prize-card-bg-1" : "prize-card-bg-2"
                }`}
              >
                <span className="raffle-bg-cover absolute inset-0" />
                <div className="relative mr-8 flex h-full flex-col items-center justify-center gap-3 p-3">
                  <img
                    onClick={onPrizeClick}
                    src={imageUrl ?? "/assets/images/prize-tap/default.svg"}
                    alt={name}
                    className={`${!isPrizeNft ? "ml-1" : ""} w-28 object-cover`}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="right-side w-full p-5">
            <div className="right-side-top flex items-start justify-between ">
              <div className="prize_data">
                <div className="prize_name__socialMedia flex items-center justify-center gap-2">
                  <p className="text-base font-medium leading-[19.5px] text-white">
                    {prizeName}
                  </p>
                  {twitterUrl && (
                    <a href={twitterUrl} target="_blank">
                      <Icon
                        iconSrc="assets/images/prize-tap/twitter-logo.svg"
                        width="20px"
                        className="rounded-xl border border-bg06 bg-bg04 p-1 px-2"
                        height="16px"
                        hoverable
                      />
                    </a>
                  )}
                  {discordUrl && (
                    <a href={discordUrl} target="_blank">
                      <Icon
                        iconSrc="assets/images/prize-tap/discord-logo.svg"
                        className="rounded-xl border border-bg06 bg-bg04 p-1 px-2"
                        width="20px"
                        height="16px"
                        hoverable
                      />
                    </a>
                  )}
                </div>
                <div
                  className="prize-creator_name mt-2 text-[10px] font-medium leading-[12.19px] text-[#979BA9] hover:cursor-pointer"
                  onClick={() => {
                    creatorUrl && window.open(creatorUrl, "_blank");
                  }}
                >
                  by {creator}
                </div>
              </div>
              {!winnersEntry.length && !userEntry?.txHash ? (
                // user can enroll in raffle

                <div className="enroll-btn cursor-pointer">
                  <button
                    onClick={() => openEnrollModal(raffle, "Verify")}
                    className="enroll-button rounded-[18px] p-[1px] text-sm"
                  >
                    <div className="flex h-[36px] min-w-[208px] items-center justify-center rounded-3xl">
                      <p className="bg-ut-grad-ltr bg-clip-text font-semibold text-transparent">
                        Enroll
                      </p>
                    </div>
                  </button>
                </div>
              ) : !winnersEntry.length && userEntry?.txHash ? (
                //user enrolled
                <div className="enrolled-btn flex h-[36px] w-52 max-w-[208px] cursor-pointer items-center justify-between rounded-3xl border border-[#1e3828] bg-enrolled-grad-btn px-4 text-xs">
                  <p className="text-sm font-medium leading-[14px]  text-[#83B39E]">
                    Enrolled!
                  </p>
                  <svg
                    width="30"
                    height="24"
                    viewBox="0 0 30 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M0.5 6C0.5 2.96243 2.96243 0.5 6 0.5H24C27.0376 0.5 29.5 2.96243 29.5 6V8.53924C27.8866 8.79533 26.6875 10.2722 26.6875 12C26.6875 13.7278 27.8866 15.2047 29.5 15.4608V18C29.5 21.0376 27.0376 23.5 24 23.5H6C2.96243 23.5 0.5 21.0376 0.5 18V15.4608C2.11341 15.2047 3.3125 13.7278 3.3125 12C3.3125 10.2722 2.11341 8.79533 0.5 8.53924V6Z"
                      fill="url(#paint0_linear_30_138)"
                      stroke="url(#paint1_linear_30_138)"
                    />
                    <path
                      d="M0 6C0 2.68629 2.68629 0 6 0H24C27.3137 0 30 2.68629 30 6V9C28.4467 9 27.1875 10.3431 27.1875 12C27.1875 13.6569 28.4467 15 30 15V18C30 21.3137 27.3137 24 24 24H6C2.68629 24 0 21.3137 0 18V15C1.5533 15 2.8125 13.6569 2.8125 12C2.8125 10.3431 1.5533 9 0 9V6Z"
                      fill="url(#paint2_radial_30_138)"
                    />
                    <defs>
                      <linearGradient
                        id="paint0_linear_30_138"
                        x1="-7.5"
                        y1="-10.5"
                        x2="27.4294"
                        y2="20.8504"
                        gradientUnits="userSpaceOnUse"
                      >
                        <stop stop-color="#2F6756" />
                        <stop offset="0.427083" stop-color="#1D0926" />
                        <stop offset="0.699054" stop-color="#2F1237" />
                        <stop offset="1" stop-color="#3A1840" />
                      </linearGradient>
                      <linearGradient
                        id="paint1_linear_30_138"
                        x1="-1.78322"
                        y1="12"
                        x2="33.8369"
                        y2="13.0497"
                        gradientUnits="userSpaceOnUse"
                      >
                        <stop stop-color="#4BF2A2" />
                        <stop offset="0.522948" stop-color="#A89FE7" />
                        <stop offset="0.669499" stop-color="#E1C4F4" />
                        <stop offset="1" stop-color="#DD40CD" />
                        <stop offset="1" stop-color="#DD40CD" />
                      </linearGradient>
                      <radialGradient
                        id="paint2_radial_30_138"
                        cx="0"
                        cy="0"
                        r="1"
                        gradientUnits="userSpaceOnUse"
                        gradientTransform="translate(-3.5 -7) rotate(44.5185) scale(42.0743 29.8729)"
                      >
                        <stop stop-color="#2F6756" stop-opacity="0" />
                        <stop
                          offset="0.334673"
                          stop-color="#367760"
                          stop-opacity="0"
                        />
                        <stop
                          offset="0.739673"
                          stop-color="#439371"
                          stop-opacity="0.1"
                        />
                        <stop
                          offset="0.879673"
                          stop-color="#469D77"
                          stop-opacity="0.29"
                        />
                        <stop
                          offset="1"
                          stop-color="#49A47C"
                          stop-opacity="0.81"
                        />
                      </radialGradient>
                    </defs>
                  </svg>
                </div>
              ) : !!winnersEntry.length &&
                !!userClaimEntry &&
                !userClaimEntry.claimingPrizeTx ? (
                // user can claim prize
                <div className="claim-btn cursor-pointer">
                  <button
                    onClick={() => openEnrollModal(raffle, "Claim")}
                    className="claim-button rounded-[18px] p-[1px] text-sm"
                  >
                    <div className="relative flex h-11 w-52 items-center justify-center overflow-hidden rounded-3xl px-4">
                      <p className="bg-ut-grad-ltr bg-clip-text font-semibold text-transparent">
                        Claim prize
                      </p>
                      <Image
                        className="absolute right-0"
                        alt="claimPrize"
                        src={"/assets/images/prize-tap/claimPrize.svg"}
                        width={50}
                        height={34}
                      />
                      <svg
                        width="63"
                        height="34"
                        viewBox="0 0 63 34"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="absolute right-0"
                      >
                        <path
                          d="M0 0H46C55.3888 0 63 7.61116 63 17V17C63 26.3888 55.3888 34 46 34H0V0Z"
                          fill="url(#paint0_linear_1_32)"
                        />
                        <defs>
                          <linearGradient
                            id="paint0_linear_1_32"
                            x1="10.8281"
                            y1="17"
                            x2="44.3517"
                            y2="-0.908468"
                            gradientUnits="userSpaceOnUse"
                          >
                            <stop stop-color="#24322A" stop-opacity="0" />
                            <stop
                              offset="0.659927"
                              stop-color="#CCFFE8"
                              stop-opacity="0.38"
                            />
                            <stop
                              offset="1"
                              stop-color="#EEFFF6"
                              stop-opacity="0.84"
                            />
                          </linearGradient>
                        </defs>
                      </svg>
                    </div>
                  </button>
                </div>
              ) : winnersEntry ? (
                // check winners
                <div className="check-winners-btn cursor-pointer">
                  <button
                    onClick={() => openEnrollModal(raffle, "Winners")}
                    className="check-winners-button rounded-[18px] text-sm"
                  >
                    <div className="flex h-[36px] min-w-[208px] items-center justify-center rounded-3xl text-sm font-medium leading-[17px]">
                      <p>Check for Winners</p>
                    </div>
                  </button>
                </div>
              ) : (
                ""
              )}
            </div>
            <Markdown
              content={description}
              className="right-side-description mt-2 h-[72px] font-sans text-xs font-normal leading-6 text-gray100"
            />
            <span className="prizeTap-constraint mt-[14px] flex min-h-[22px] w-full items-stretch overflow-hidden rounded-br-[10px] rounded-tr-[10px] bg-constraint-grad-ltr text-[10px]">
              <div className={`flex w-full flex-wrap gap-3 p-1 text-gray100`}>
                {(showAllPermissions
                  ? raffle.constraints
                  : raffle.constraints
                      .filter((permission) => permission.type === "VER")
                      .slice(0, 6)
                ).map((permission, key) => (
                  <Tooltip
                    onClick={openEnrollModal.bind(null, raffle, "Verify")}
                    className={"cursor-pointer border-r border-white "}
                    data-testid={`token-verification-${raffle.id}-${permission.name}`}
                    key={key}
                    text={replacePlaceholders(
                      (permission.isReversed
                        ? permission.negativeDescription
                        : permission.description)!,
                      params[permission.name],
                    )}
                  >
                    <div className=" flex w-full pr-4">
                      {permission.isReversed && "Not "}
                      {permission.title}
                    </div>
                  </Tooltip>
                ))}
              </div>
              {raffle.constraints.length > 6 && (
                <button
                  onClick={setShowAllPermissions.bind(
                    null,
                    !showAllPermissions,
                  )}
                  className=" z-10 flex h-auto w-[34px] items-center justify-center bg-constraint-grad-btn transition-colors"
                >
                  <svg
                    width="10"
                    height="4"
                    viewBox="0 0 10 4"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className={`ml-2 ${
                      showAllPermissions ? "rotate-180" : ""
                    } mr-1 transition-transform`}
                  >
                    <path
                      d="M10 0L5.88384 3.67453C5.39773 4.10849 4.60227 4.10849 4.11616 3.67453L0 0"
                      fill="#B5B5C6"
                    />
                  </svg>
                </button>
              )}
            </span>
          </div>
        </div>
        <div className="flex h-[40px] items-center justify-between bg-gray30 px-9">
          <div className="flex font-medium leading-[14.63px]">
            <p className="mr-1 text-xs text-gray100">
              <span className="mr-1">On</span>
              {chain.chainName}
            </p>
            <Icon iconSrc={chain.logoUrl} width="20px" height="16px" />
          </div>
          <div>
            {isRaffleEnd ? (
              <div className="mt-[10px] flex h-8 min-w-[184px] items-center justify-center rounded-tl-xl rounded-tr-xl bg-gray00">
                <p className="lead-[14px] text-xs font-medium text-gray100 ">
                  This raffle has ended
                </p>
              </div>
            ) : (
              <RaffleCardTimer startTime={startAt} FinishTime={deadline} />
            )}
          </div>
          <div className="flex">
            {" "}
            <p className="text-xs text-gray100">
              {maxNumberOfEntries >= 1_000_000_000
                ? `${numberWithCommas(numberOfOnchainEntries)} people enrolled`
                : !isRemainingPercentLessThanTen
                  ? `
											${numberOfOnchainEntries} / ${numberWithCommas(
                        maxNumberOfEntries,
                      )} people enrolled`
                  : remainingPeople > 0
                    ? `${remainingPeople} people remains`
                    : `${numberWithCommas(maxNumberOfEntries)} people enrolled`}
            </p>
          </div>
        </div>
      </div>

      {/* <div className="flex flex-col lg:flex-row items-center justify-center gap-4 p-5 lg:p-0 rounded-xl bg-gray30 lg:bg-inherit">
        <div className="prize-card__image relative mb-3 lg:mb-0">
          <div
            className={
              isHighlighted
                ? "gradient-outline-card p-[2px] before:!inset-[2px]"
                : ""
            }
          >
            <div
              className={`prize-card__container flex h-[212px] w-[212px] flex-col ${
                isHighlighted
                  ? "bg-g-primary-low "
                  : "border-2 border-gray40 bg-gray30"
              } items-center justify-center rounded-xl p-5`}
            >
              {imageUrl && (
                <img
                  onClick={onPrizeClick}
                  src={imageUrl}
                  alt={name}
                  width={!isPrizeNft ? "168px" : ""}
                  className={`${!isPrizeNft ? "ml-1" : ""} mb-2 cursor-pointer`}
                />
              )}
            </div>
          </div>
          <div className="absolute bottom-[-10px] left-[40px] flex min-w-[130px] items-center justify-center rounded-md border-2 border-gray70 bg-gray50">
            <p className="p-1 text-2xs text-gray100"> on {chain.chainName} </p>
            <Icon iconSrc={chain.logoUrl} width="20px" height="16px" />
          </div>
        </div>
        <div
          className={
            isHighlighted
              ? "gradient-outline-card w-full p-[2px] before:!inset-[3px]"
              : "w-full"
          }
        >
          <div
            className={`card prize-card__content relative z-10 h-full md:max-h-[225px] md:min-h-[212px] ${
              isHighlighted
                ? "bg-g-primary-low"
                : "border-2 border-gray40 bg-gray30"
            } flex h-full w-full flex-col rounded-xl p-4 pt-3`}
          >
            <span className="mb-1 flex w-full items-center">
              <p
                className="cursor-pointer text-sm text-white"
                onClick={onPrizeClick}
              >
                {prizeName}
              </p>
              {winnersCount > 1 && (
                <small className="ml-5 rounded-xl bg-gray10 p-1 px-2 text-xs font-semibold text-gray100">
                  {winnersCount}x Winners
                </small>
              )}
              <div className="ml-auto flex gap-4">
                {twitterUrl && (
                  <Icon
                    iconSrc="assets/images/prize-tap/twitter-logo.svg"
                    onClick={() => window.open(twitterUrl, "_blank")}
                    width="20px"
                    height="16px"
                    hoverable
                  />
                )}
                {discordUrl && (
                  <Icon
                    iconSrc="assets/images/prize-tap/discord-logo.svg"
                    onClick={() => window.open(discordUrl, "_blank")}
                    width="20px"
                    height="16px"
                    hoverable
                  />
                )}
              </div>
            </span>
            <span className="mb-4 flex w-full justify-between">
              <p className="prize-card__source text-xs text-gray90">
                {!isPrizeNft ? (
                  <span
                    className="hover:cursor-pointer"
                    onClick={() => window.open(creatorUrl, "_blank")}
                  >
                    by {creator}
                  </span>
                ) : (
                  <span
                    className="hover:cursor-pointer"
                    onClick={() => window.open(creatorUrl, "_blank")}
                  >
                    by {creator}
                  </span>
                )}
              </p>
            </span>
            <ReactMarkdown
              className={`prize-card__description mb-2 shrink-0 grow basis-auto text-xs leading-5 text-gray100 ${
                isHighlighted ? "bg-g-primary-low" : "!bg-gray30"
              } text-justify`}
            >
              {description}
            </ReactMarkdown>

            {!winnersEntry.length &&
              !userEntry?.txHash &&
              !raffle.isExpired && (
                <span className="mb-3 text-xs">
                  <div
                    className={`flex flex-wrap items-center gap-2 text-xs text-white`}
                  >
                    {(showAllPermissions
                      ? raffle.constraints
                      : raffle.constraints
                          .filter((permission) => permission.type === "VER")
                          .slice(0, 6)
                    ).map((permission, key) => (
                      <Tooltip
                        onClick={openEnrollModal.bind(null, raffle, "Verify")}
                        className={
                          "rounded-lg border border-gray70 bg-gray50 px-3 py-2 transition-colors hover:bg-gray10 "
                        }
                        data-testid={`token-verification-${raffle.id}-${permission.name}`}
                        key={key}
                        text={replacePlaceholders(
                          (permission.isReversed
                            ? permission.negativeDescription
                            : permission.description)!,
                          params[permission.name],
                        )}
                      >
                        <div className="flex items-center gap-3">
                          {permission.isReversed && "Not "}
                          {permission.title}
                        </div>
                      </Tooltip>
                    ))}

                    {raffle.constraints.length > 6 && (
                      <button
                        onClick={setShowAllPermissions.bind(
                          null,
                          !showAllPermissions,
                        )}
                        className="z-10 flex items-center rounded-lg border border-gray70 bg-gray60 px-3 py-2 transition-colors"
                      >
                        <span>
                          {showAllPermissions ? "Show less" : "Show more"}
                        </span>
                        <Image
                          width={12}
                          height={7}
                          alt="angle down"
                          src="/assets/images/token-tap/angle-down.svg"
                          className={`ml-2 ${
                            showAllPermissions ? "rotate-180" : ""
                          } transition-transform`}
                        />
                      </button>
                    )}
                  </div>
                </span>
              )}

            <Action className={"w-full items-center sm:w-auto sm:items-end "}>
              {(isExpired && !winnersEntry.length && !userEntry?.txHash) ||
              (!winnersEntry.length &&
                !userEntry?.txHash &&
                maxNumberOfEntries === numberOfOnchainEntries) ? (
                <span className="flex w-full flex-col items-center justify-between gap-4 md:flex-row ">
                  <div className="flex w-full flex-col justify-between gap-4 rounded-xl bg-gray40 px-5 py-1 sm:flex-row md:items-center">
                    <div className="flex flex-col gap-1">
                      <p className="text-2xs text-white">
                        {start ? "Winners Announced in:" : "Starts in:"}
                      </p>
                      <p className="text-2xs text-gray100">
                        {maxNumberOfEntries >= 1_000_000_000
                          ? `${numberWithCommas(
                              numberOfOnchainEntries,
                            )} people enrolled`
                          : !isRemainingPercentLessThanTen
                            ? `
											${numberOfOnchainEntries} / ${numberWithCommas(
                        maxNumberOfEntries,
                      )} people enrolled`
                            : remainingPeople > 0
                              ? `${remainingPeople} people remains`
                              : `${numberWithCommas(
                                  maxNumberOfEntries,
                                )} people enrolled`}
                      </p>
                    </div>
                    <RaffleCardTimer
                      startTime={startAt}
                      FinishTime={deadline}
                    />
                  </div>
                  <ClaimAndEnrollButton
                    disabled={true}
                    className="!w-full min-w-[552px] md:!w-[352px]"
                    height="48px"
                    $fontSize="14px"
                  >
                    {" "}
                    <div className="relative w-full">
                      {maxNumberOfEntries === numberOfOnchainEntries ? (
                        <p> Full</p>
                      ) : (
                        <p> Unavailable</p>
                      )}
                      <Icon
                        className="absolute right-0 top-[-2px]"
                        iconSrc="assets/images/prize-tap/header-prize-logo.svg"
                        width="27px"
                        height="24px"
                      />
                    </div>
                  </ClaimAndEnrollButton>
                </span>
              ) : !winnersEntry.length && !userEntry?.txHash ? (
                <span className="flex w-full flex-col items-center justify-between gap-4 md:flex-row ">
                  <div className="flex w-full flex-col justify-between gap-4 rounded-xl bg-gray40 px-5 py-1 sm:flex-row md:items-center">
                    <div className="flex flex-col gap-1">
                      <p className="text-2xs text-white">
                        {start ? "Winners Announced in:" : "Starts in:"}
                      </p>
                      <p className="text-2xs text-gray100">
                        {maxNumberOfEntries >= 1_000_000_000
                          ? `${numberWithCommas(
                              numberOfOnchainEntries,
                            )} people enrolled`
                          : !isRemainingPercentLessThanTen
                            ? `
													${numberOfOnchainEntries} / ${numberWithCommas(
                            maxNumberOfEntries,
                          )} people enrolled`
                            : remainingPeople > 0
                              ? `${remainingPeople} people remains`
                              : `${numberWithCommas(
                                  maxNumberOfEntries,
                                )} people enrolled`}
                      </p>
                    </div>
                    <RaffleCardTimer
                      startTime={startAt}
                      FinishTime={deadline}
                    />
                  </div>
                  <ClaimAndEnrollButton
                    height="48px"
                    $fontSize="14px"
                    disabled={!start}
                    className="!w-full min-w-[552px] md:!w-[352px]"
                    onClick={() => openEnrollModal(raffle, "Verify")}
                  >
                    {" "}
                    <div className="relative w-full">
                      <p className="bg-g-primary bg-clip-text text-transparent">
                        Enroll
                      </p>{" "}
                      <Icon
                        className="absolute right-0 top-[-2px]"
                        iconSrc="assets/images/prize-tap/header-prize-logo.svg"
                        width="27px"
                        height="24px"
                      />
                    </div>
                  </ClaimAndEnrollButton>
                </span>
              ) : !winnersEntry.length && userEntry?.txHash ? (
                <span className="flex w-full flex-col items-center justify-between gap-4 md:flex-row ">
                  <div className="flex w-full flex-col justify-between gap-4 rounded-xl bg-gray40 px-5 py-1 sm:flex-row md:items-center">
                    <div className="flex flex-col gap-1">
                      <p className="text-2xs text-white">
                        {start ? "Winners Announced in:" : "Starts in:"}
                      </p>
                      <p className="text-2xs text-gray100">
                        {maxNumberOfEntries >= 1_000_000_000
                          ? `${numberWithCommas(
                              numberOfOnchainEntries,
                            )} people enrolled`
                          : !isRemainingPercentLessThanTen
                            ? `
													${numberOfOnchainEntries} / ${numberWithCommas(
                            maxNumberOfEntries,
                          )} people enrolled`
                            : remainingPeople > 0
                              ? `${remainingPeople} people remains`
                              : `${numberWithCommas(
                                  maxNumberOfEntries,
                                )} people enrolled`}
                      </p>
                    </div>
                    <RaffleCardTimer
                      startTime={startAt}
                      FinishTime={deadline}
                    />
                  </div>
                  <EnrolledButton
                    disabled={true}
                    className="!w-full  min-w-[552px] md:!w-[352px]"
                    height="48px"
                    $fontSize="14px"
                  >
                    <div className="relative flex w-full">
                      <span
                        className={`${
                          !winnersEntry.length &&
                          new Date(deadline) < new Date()
                            ? "text-sm"
                            : ""
                        } bg-g-primary bg-clip-text text-transparent`}
                      >
                        {!winnersEntry.length && new Date(deadline) < new Date()
                          ? "Raffle is being processed"
                          : "Enrolled"}
                      </span>
                      <Icon
                        className="absolute right-0 top-[-2px]"
                        iconSrc="/assets/images/prize-tap/enrolled-ticket.svg"
                        width="27px"
                        height="24px"
                      />
                    </div>
                  </EnrolledButton>
                </span>
              ) : winnersEntry && !userClaimEntry ? (
                <div className="flex w-full flex-1 items-center gap-4">
                  <span className="align-center flex h-[70px] w-full items-center justify-between overflow-hidden rounded-xl bg-gray10 py-1 font-medium leading-[15px] md:h-[48px] md:leading-[normal]">
                    <p className="ml-4 text-2xs text-gray100">
                      {maxNumberOfEntries >= 1_000_000_000
                        ? `${numberWithCommas(
                            numberOfOnchainEntries,
                          )} people enrolled`
                        : !isRemainingPercentLessThanTen
                          ? `
													${numberOfOnchainEntries} / ${numberWithCommas(
                            maxNumberOfEntries,
                          )} people enrolled`
                          : `${numberWithCommas(
                              maxNumberOfEntries,
                            )} people enrolled`}
                    </p>
                    <Icon
                      className="mt-[-25px] opacity-[.3]  md:mt-[-10px] "
                      iconSrc="assets/images/prize-tap/winner_bg_diamond.svg"
                      width="215px"
                      height="215px"
                    />
                  </span>

                  <ClaimAndEnrollButton
                    height="48px"
                    $fontSize="14px"
                    className="!w-full  min-w-[552px] md:!w-[352px]"
                    onClick={() => openEnrollModal(raffle, "Winners")}
                  >
                    <div className="relative w-full">
                      <span className="bg-g-primary bg-clip-text text-transparent">
                        Check Winners
                      </span>
                    </div>
                  </ClaimAndEnrollButton>
                </div>
              ) : !!winnersEntry.length &&
                !!userClaimEntry &&
                !userClaimEntry.claimingPrizeTx ? (
                <span className="flex w-full flex-col items-center justify-between gap-4 md:flex-row ">
                  <div className="winner-box-bg flex h-[48px] w-full items-center justify-between gap-4 overflow-hidden rounded-xl  px-5 py-1">
                    <p className="text-2xs text-white">
                      Congratulations @
                      {userProfile?.username ||
                        shortenAddress(userProfile?.wallets?.[0].address)}{" "}
                      ! claim your prize now.
                    </p>
                    <Icon
                      className="mr-[-20px] mt-[-10px] opacity-[.3]"
                      iconSrc="assets/images/prize-tap/winner_bg_diamond.svg"
                      width="215px"
                      height="215px"
                    />
                  </div>

                  <ClaimPrizeButton
                    height="48px"
                    $fontSize="14px"
                    className="!w-full min-w-[552px] md:!w-[352px]"
                    onClick={() => openEnrollModal(raffle, "Claim")}
                  >
                    {" "}
                    <div className="relative w-full text-gray10">
                      <p> Claim Prize</p>{" "}
                    </div>
                  </ClaimPrizeButton>
                </span>
              ) : (
                <span className="flex w-full flex-col items-center justify-between gap-4 md:flex-row ">
                  <div className="winner-box-bg flex h-[48px] w-full items-center justify-between gap-4 overflow-hidden rounded-xl  py-1 pl-5">
                    <p className="text-2xs text-white">
                      Congratulations @
                      {userProfile?.username ||
                        shortenAddress(userProfile?.wallets?.[0].address)}
                      !
                    </p>
                    <Icon
                      className="mt-[-10px] opacity-[.3]"
                      iconSrc="assets/images/prize-tap/winner_bg_diamond.svg"
                      width="215px"
                      height="215px"
                    />
                  </div>
                  <div className="claimed-prize !w-full md:!w-[352px]">
                    <div className="relative">
                      <p className="!font-semibold">Claimed</p>
                      <Icon
                        className="absolute right-0 top-[-2px]"
                        iconSrc="assets/images/prize-tap/header-prize-logo.svg"
                        width="27px"
                        height="24px"
                      />
                    </div>
                  </div>
                </span>
              )}
            </Action>
          </div>
        </div>
      </div> */}
    </div>
  );
};

type RaffleCardTimerProps = {
  startTime: string;
  FinishTime: string;
};

export const RaffleCardTimer = ({
  startTime,
  FinishTime,
}: RaffleCardTimerProps) => {
  const [now, setNow] = useState(new Date());
  const [days, setDays] = useState("00");
  const [hours, setHours] = useState("00");
  const [minutes, setMinutes] = useState("00");
  const [seconds, setSeconds] = useState("00");
  const [start, setStarted] = useState<boolean>(true);

  const startTimeDate = useMemo(() => new Date(startTime), [startTime]);

  const FinishTimeDate = useMemo(
    () => new Date(start ? FinishTime : new Date()),
    [FinishTime, start],
  );

  const deadline = useMemo(
    () =>
      startTimeDate.getTime() > now.getTime() ? startTimeDate : FinishTimeDate,
    [startTimeDate, FinishTimeDate, now],
  );

  useEffect(() => {
    const diff = deadline.getTime() - now.getTime();
    if (diff <= 0) {
      setDays("00");
      setHours("00");
      setMinutes("00");
      setSeconds("00");

      return;
    }
    // time calculations for days, hours, minutes and seconds
    const newDays = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    setSeconds(seconds < 10 ? `0${seconds}` : seconds.toString());
    setMinutes(minutes < 10 ? `0${minutes}` : minutes.toString());
    setHours(hours < 10 ? `0${hours}` : hours.toString());
    setDays(newDays < 10 ? `0${newDays}` : newDays.toString());
  }, [now, deadline]);

  useEffect(() => {
    const interval = setInterval(() => {
      setStarted(new Date(startTime) < new Date());
      setNow(new Date());
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [startTime]);

  return (
    <div className="prize-card__timer mt-[10px] flex h-8 min-w-[184px] items-center justify-between gap-4 rounded-tl-xl rounded-tr-xl bg-gray00 py-2 md:px-3">
      <div className="prize-card__timer-item flex flex-col items-center justify-between text-2xs">
        <p className="prize-card__timer-item-value min-w-[15px] text-center font-semibold text-white">
          {days}
        </p>
      </div>
      <p className="text-sm text-white">:</p>
      <div className="prize-card__timer-item flex flex-col items-center justify-between text-2xs">
        <p className="prize-card__timer-item-value min-w-[15px] text-center font-semibold text-white">
          {hours}
        </p>
      </div>
      <p className="text-sm text-white">:</p>
      <div className="prize-card__timer-item flex flex-col items-center justify-between text-2xs">
        <p className="prize-card__timer-item-value min-w-[15px] text-center font-semibold text-white">
          {minutes}
        </p>
      </div>
      <p className="text-sm text-white">:</p>
      <div className="prize-card__timer-item flex flex-col items-center justify-between text-2xs">
        <p className="prize-card__timer-item-value min-w-[15px] text-center  font-semibold text-white">
          {seconds}
        </p>
      </div>
    </div>
  );
};

export const RaffleCardTimerLandingPage = ({
  startTime,
  FinishTime,
}: RaffleCardTimerProps) => {
  const [now, setNow] = useState(new Date());
  const [days, setDays] = useState("00");
  const [hours, setHours] = useState("00");
  const [minutes, setMinutes] = useState("00");
  const [seconds, setSeconds] = useState("00");

  let startTimeDate = useMemo(() => new Date(startTime), [startTime]);
  let FinishTimeDate = useMemo(() => new Date(FinishTime), [FinishTime]);

  let deadline = useMemo(
    () =>
      startTimeDate.getTime() > now.getTime() ? startTimeDate : FinishTimeDate,
    [startTimeDate, FinishTimeDate, now],
  );

  useEffect(() => {
    const diff = deadline.getTime() - now.getTime();
    if (diff <= 0) {
      return;
    }
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    setSeconds(seconds < 10 ? `0${seconds}` : seconds.toString());
    setMinutes(minutes < 10 ? `0${minutes}` : minutes.toString());
    setHours(hours < 10 ? `0${hours}` : hours.toString());
    setDays(days < 10 ? `0${days}` : days.toString());
  }, [now, deadline]);

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="prize-card__timer mt-[-2px] flex items-center gap-1 text-gray100 md:px-1">
      <div className="prize-card__timer-item flex flex-col items-center justify-between text-2xs">
        <p className="prize-card__timer-item-value font-semibold">{days}</p>
      </div>
      <p className="text-sm">:</p>
      <div className="prize-card__timer-item flex flex-col items-center justify-between text-2xs">
        <p className="prize-card__timer-item-value font-semibold">{hours}</p>
      </div>
      <p className="text-sm">:</p>
      <div className="prize-card__timer-item flex flex-col items-center justify-between text-2xs">
        <p className="prize-card__timer-item-value font-semibold">{minutes}</p>
      </div>
      <p className="text-sm">:</p>
      <div className="prize-card__timer-item flex flex-col items-center justify-between text-2xs">
        <p className="prize-card__timer-item-value font-semibold">{seconds}</p>
      </div>
    </div>
  );
};

export default RafflesList;
