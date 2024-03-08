"use client";

import { FC, useEffect, useMemo, useState, useContext } from "react";
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
import { LINEA_RAFFLE_PK } from "@/constants";
import { getAssetUrl, shortenAddress } from "@/utils";

// import Styles from "@/components/containers/provider-dashboard/prize-tap/content.module.scss";
import { zeroAddress } from "viem";
import { useFastRefresh } from "@/utils/hooks/refresh";

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
    [rafflesList, highlightedPrize]
  );

  useEffect(() => {
    const highlightedPrize = params.get("icebox");

    setHighlightedPrize(highlightedPrize || "");
  }, [params, setHighlightedPrize]);

  return (
    <div className="grid md:flex-row wrap w-full mb-4 gap-4">
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
  props
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

  const creator = creatorName || creatorProfile?.username;

  const { openEnrollModal } = usePrizeTapContext();
  const { userProfile } = useUserProfileContext();
  const remainingPeople = maxNumberOfEntries - numberOfOnchainEntries;
  const isRemainingPercentLessThanTen =
    remainingPeople < (maxNumberOfEntries / 100) * 10;
  const [start, setStarted] = useState<boolean>(true);
  const [showAllPermissions, setShowAllPermissions] = useState(false);

  const userClaimEntry = useMemo(
    () => winnersEntry?.find((item) => item.userProfile.pk === userProfile?.pk),
    [userProfile, winnersEntry]
  );

  useFastRefresh(() => {
    setStarted(new Date(startAt) < new Date());
  }, [startAt]);

  const prizeLink = getAssetUrl(chain, raffle.prizeAsset!);

  const onPrizeClick = () => {
    if (raffle.prizeAsset == zeroAddress) return;
    if (prizeLink) window.open(prizeLink, "_blank");
  };

  return (
    <div>
      <div className="h-[227px] rounded-[28px] overflow-hidden">
        <div
          className={`h-[187px] flex bg-gray20 ${
            isPrizeNft ? "prize-card-bg-1" : "prize-card-bg-2"
          }`}
        >
          <div className="min-w-[308px] h-full left-side"></div>
          <div className="w-full right-side p-5">
            <div className="right-side-top flex justify-between items-start ">
              <div className="prize_data">
                <div className="prize_name__socialMedia flex items-center justify-center gap-2">
                  <p className="text-white text-base font-medium leading-[19.5px]">
                    {prizeName}
                  </p>
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
                <div
                  className="prize-creator_name hover:cursor-pointer text-[10px] text-[#979BA9] font-medium leading-[12.19px]"
                  onClick={() => {
                    creatorUrl && window.open(creatorUrl, "_blank");
                  }}
                >
                  by {creator}
                </div>
              </div>
              <div className="enroll-btn cursor-pointer"></div>
            </div>
            <div className="right-side-description h-[72px] text-xs mt-2 leading-6 font-normal font-sans text-gray100">
              {description}
            </div>
            <div></div>
          </div>
        </div>
        <div className="h-[40px] bg-gray30"></div>
      </div>

      <div className="flex flex-col lg:flex-row items-center justify-center gap-4 p-5 lg:p-0 rounded-xl bg-gray30 lg:bg-inherit">
        <div className="prize-card__image relative mb-3 lg:mb-0">
          <div
            className={
              isHighlighted
                ? "before:!inset-[2px] p-[2px] gradient-outline-card"
                : ""
            }
          >
            <div
              className={`prize-card__container h-[212px] w-[212px] flex flex-col ${
                isHighlighted
                  ? "bg-g-primary-low "
                  : "bg-gray30 border-2 border-gray40"
              } justify-center items-center p-5 rounded-xl`}
            >
              {imageUrl && (
                <img
                  onClick={onPrizeClick}
                  src={imageUrl}
                  alt={name}
                  width={!isPrizeNft ? "168px" : ""}
                  className={`${!isPrizeNft ? "ml-1" : ""} cursor-pointer mb-2`}
                />
              )}
              {/* {!isPrizeNft && (
								<div className="prize__amount" data-amount={calculateClaimAmount + '   ' + prizeSymbol}>
									{calculateClaimAmount + '  ' + prizeSymbol}
								</div>
							)} */}
            </div>
          </div>
          <div className="absolute bottom-[-10px] left-[40px] rounded-md flex items-center bg-gray50 border-2 border-gray70 min-w-[130px] justify-center">
            <p className="text-gray100 text-2xs p-1"> on {chain.chainName} </p>
            <Icon iconSrc={chain.logoUrl} width="20px" height="16px" />
          </div>
        </div>
        <div
          className={
            isHighlighted
              ? "before:!inset-[3px] p-[2px] gradient-outline-card w-full"
              : "w-full"
          }
        >
          <div
            className={`card prize-card__content z-10 relative h-full md:max-h-[225px] md:min-h-[212px] ${
              isHighlighted
                ? "bg-g-primary-low"
                : "bg-gray30 border-2 border-gray40"
            } rounded-xl p-4 pt-3 flex flex-col w-full h-full`}
          >
            <span className="flex items-center w-full mb-1">
              <p
                className="cursor-pointer text-white text-sm"
                onClick={onPrizeClick}
              >
                {prizeName}
              </p>
              {winnersCount > 1 && (
                <small className="rounded-xl ml-5 font-semibold text-xs p-1 px-2 bg-gray10 text-gray100">
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
            <span className="flex justify-between w-full mb-4">
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
            <p className="prize-card__description text-gray100 text-xs leading-5 mb-2 grow shrink-0 basis-auto text-justify">
              {description}
            </p>

            {!winnersEntry.length &&
              !userEntry?.txHash &&
              !raffle.isExpired && (
                <span className="text-xs mb-3">
                  <div
                    className={`flex items-center flex-wrap text-xs gap-2 text-white`}
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
                          "border-gray70 bg-gray50 hover:bg-gray10 transition-colors border px-3 py-2 rounded-lg "
                        }
                        data-testid={`token-verification-${raffle.id}-${permission.name}`}
                        key={key}
                        text={
                          permission.isReversed
                            ? permission.negativeDescription
                            : permission.description
                        }
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
                          !showAllPermissions
                        )}
                        className="border-gray70 flex items-center z-10 bg-gray60 transition-colors border px-3 py-2 rounded-lg"
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

            <Action className={"w-full sm:w-auto items-center sm:items-end "}>
              {(isExpired && !winnersEntry.length && !userEntry?.txHash) ||
              (!winnersEntry.length &&
                !userEntry?.txHash &&
                maxNumberOfEntries === numberOfOnchainEntries) ? (
                <span className="flex flex-col md:flex-row items-center justify-between w-full gap-4 ">
                  <div className="flex flex-col sm:flex-row gap-4 justify-between w-full md:items-center bg-gray40 px-5 py-1 rounded-xl">
                    <div className="flex flex-col gap-1">
                      <p className="text-2xs text-white">
                        {start ? "Winners Announced in:" : "Starts in:"}
                      </p>
                      <p className="text-2xs text-gray100">
                        {maxNumberOfEntries >= 1_000_000_000
                          ? `${numberWithCommas(
                              numberOfOnchainEntries
                            )} people enrolled`
                          : !isRemainingPercentLessThanTen
                          ? `
											${numberOfOnchainEntries} / ${numberWithCommas(
                              maxNumberOfEntries
                            )} people enrolled`
                          : remainingPeople > 0
                          ? `${remainingPeople} people remains`
                          : `${numberWithCommas(
                              maxNumberOfEntries
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
                    className="min-w-[552px] md:!w-[352px] !w-full"
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
                <span className="flex flex-col md:flex-row items-center justify-between w-full gap-4 ">
                  <div className="flex flex-col sm:flex-row gap-4 justify-between w-full md:items-center bg-gray40 px-5 py-1 rounded-xl">
                    <div className="flex flex-col gap-1">
                      <p className="text-2xs text-white">
                        {start ? "Winners Announced in:" : "Starts in:"}
                      </p>
                      <p className="text-2xs text-gray100">
                        {maxNumberOfEntries >= 1_000_000_000
                          ? `${numberWithCommas(
                              numberOfOnchainEntries
                            )} people enrolled`
                          : !isRemainingPercentLessThanTen
                          ? `
													${numberOfOnchainEntries} / ${numberWithCommas(
                              maxNumberOfEntries
                            )} people enrolled`
                          : remainingPeople > 0
                          ? `${remainingPeople} people remains`
                          : `${numberWithCommas(
                              maxNumberOfEntries
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
                    className="min-w-[552px] md:!w-[352px] !w-full"
                    onClick={() => openEnrollModal(raffle, "Verify")}
                  >
                    {" "}
                    <div className="relative w-full">
                      <p className="text-transparent bg-clip-text bg-g-primary">
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
                <span className="flex flex-col md:flex-row items-center justify-between w-full gap-4 ">
                  <div className="flex flex-col sm:flex-row gap-4 justify-between w-full md:items-center bg-gray40 px-5 py-1 rounded-xl">
                    <div className="flex flex-col gap-1">
                      <p className="text-2xs text-white">
                        {start ? "Winners Announced in:" : "Starts in:"}
                      </p>
                      <p className="text-2xs text-gray100">
                        {maxNumberOfEntries >= 1_000_000_000
                          ? `${numberWithCommas(
                              numberOfOnchainEntries
                            )} people enrolled`
                          : !isRemainingPercentLessThanTen
                          ? `
													${numberOfOnchainEntries} / ${numberWithCommas(
                              maxNumberOfEntries
                            )} people enrolled`
                          : remainingPeople > 0
                          ? `${remainingPeople} people remains`
                          : `${numberWithCommas(
                              maxNumberOfEntries
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
                    className="min-w-[552px]  md:!w-[352px] !w-full"
                    height="48px"
                    $fontSize="14px"
                  >
                    <div className="relative w-full flex">
                      <span
                        className={`${
                          !winnersEntry.length &&
                          new Date(deadline) < new Date()
                            ? "text-sm"
                            : ""
                        } text-transparent bg-clip-text bg-g-primary`}
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
                  <span className="overflow-hidden font-medium md:leading-[normal] leading-[15px] flex h-[70px] md:h-[48px] w-full items-center bg-gray10 py-1 rounded-xl align-center justify-between">
                    <p className="text-2xs ml-4 text-gray100">
                      {maxNumberOfEntries >= 1_000_000_000
                        ? `${numberWithCommas(
                            numberOfOnchainEntries
                          )} people enrolled`
                        : !isRemainingPercentLessThanTen
                        ? `
													${numberOfOnchainEntries} / ${numberWithCommas(
                            maxNumberOfEntries
                          )} people enrolled`
                        : `${numberWithCommas(
                            maxNumberOfEntries
                          )} people enrolled`}
                    </p>
                    <Icon
                      className="opacity-[.3] mt-[-25px]  md:mt-[-10px] "
                      iconSrc="assets/images/prize-tap/winner_bg_diamond.svg"
                      width="215px"
                      height="215px"
                    />
                  </span>

                  <ClaimAndEnrollButton
                    height="48px"
                    $fontSize="14px"
                    className="min-w-[552px]  md:!w-[352px] !w-full"
                    onClick={() => openEnrollModal(raffle, "Winners")}
                  >
                    <div className="relative w-full">
                      <span className="text-transparent bg-clip-text bg-g-primary">
                        Check Winners
                      </span>
                    </div>
                  </ClaimAndEnrollButton>
                </div>
              ) : !!winnersEntry.length &&
                !!userClaimEntry &&
                !userClaimEntry.claimingPrizeTx ? (
                <span className="flex flex-col md:flex-row items-center justify-between w-full gap-4 ">
                  <div className="flex gap-4 overflow-hidden px-5 h-[48px] justify-between w-full items-center winner-box-bg  py-1 rounded-xl">
                    <p className="text-2xs text-white">
                      Congratulations @
                      {userProfile?.username ||
                        shortenAddress(userProfile?.wallets?.[0].address)}{" "}
                      ! claim your prize now.
                    </p>
                    <Icon
                      className="opacity-[.3] mt-[-10px] mr-[-20px]"
                      iconSrc="assets/images/prize-tap/winner_bg_diamond.svg"
                      width="215px"
                      height="215px"
                    />
                  </div>

                  <ClaimPrizeButton
                    height="48px"
                    $fontSize="14px"
                    className="min-w-[552px] md:!w-[352px] !w-full"
                    onClick={() => openEnrollModal(raffle, "Claim")}
                  >
                    {" "}
                    <div className="relative w-full text-gray10">
                      <p> Claim Prize</p>{" "}
                    </div>
                  </ClaimPrizeButton>
                </span>
              ) : (
                <span className="flex flex-col md:flex-row items-center justify-between w-full gap-4 ">
                  <div className="flex gap-4 overflow-hidden pl-5 h-[48px] justify-between w-full items-center winner-box-bg  py-1 rounded-xl">
                    <p className="text-2xs text-white">
                      Congratulations @
                      {userProfile?.username ||
                        shortenAddress(userProfile?.wallets?.[0].address)}
                      !
                    </p>
                    <Icon
                      className="opacity-[.3] mt-[-10px]"
                      iconSrc="assets/images/prize-tap/winner_bg_diamond.svg"
                      width="215px"
                      height="215px"
                    />
                  </div>
                  <div className="claimed-prize md:!w-[352px] !w-full">
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
      </div>
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
    [FinishTime, start]
  );

  const deadline = useMemo(
    () =>
      startTimeDate.getTime() > now.getTime() ? startTimeDate : FinishTimeDate,
    [startTimeDate, FinishTimeDate, now]
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
    <div className="prize-card__timer flex items-center justify-between rounded-xl gap-4 md:px-3 py-2">
      <div className="prize-card__timer-item flex flex-col justify-between items-center text-2xs">
        <p className="prize-card__timer-item-value text-white font-semibold">
          {days}
        </p>
        <p className="prize-card__timer-item-label text-gray90">d</p>
      </div>
      <p className="text-sm text-white">:</p>
      <div className="prize-card__timer-item flex flex-col justify-between items-center text-2xs">
        <p className="prize-card__timer-item-value text-white font-semibold">
          {hours}
        </p>
        <p className="prize-card__timer-item-label text-gray90">h</p>
      </div>
      <p className="text-sm text-white">:</p>
      <div className="prize-card__timer-item flex flex-col justify-between items-center text-2xs">
        <p className="prize-card__timer-item-value text-white font-semibold">
          {minutes}
        </p>
        <p className="prize-card__timer-item-label text-gray90">m</p>
      </div>
      <p className="text-sm text-white">:</p>
      <div className="prize-card__timer-item flex flex-col justify-between items-center text-2xs">
        <p className="prize-card__timer-item-value text-white font-semibold">
          {seconds}
        </p>
        <p className="prize-card__timer-item-label text-gray90">s</p>
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
    [startTimeDate, FinishTimeDate, now]
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
    <div className="prize-card__timer flex gap-1 md:px-1 mt-[-2px] text-gray100 items-center">
      <div className="prize-card__timer-item flex flex-col justify-between items-center text-2xs">
        <p className="prize-card__timer-item-value font-semibold">{days}</p>
      </div>
      <p className="text-sm">:</p>
      <div className="prize-card__timer-item flex flex-col justify-between items-center text-2xs">
        <p className="prize-card__timer-item-value font-semibold">{hours}</p>
      </div>
      <p className="text-sm">:</p>
      <div className="prize-card__timer-item flex flex-col justify-between items-center text-2xs">
        <p className="prize-card__timer-item-value font-semibold">{minutes}</p>
      </div>
      <p className="text-sm">:</p>
      <div className="prize-card__timer-item flex flex-col justify-between items-center text-2xs">
        <p className="prize-card__timer-item-value font-semibold">{seconds}</p>
      </div>
    </div>
  );
};

export default RafflesList;
