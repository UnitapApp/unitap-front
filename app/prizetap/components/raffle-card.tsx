import PermissionsCard from "@/app/_components/permissions-card";
import Markdown from "@/app/tokentap/components/Markdown";
import Icon from "@/components/ui/Icon";
import { usePrizeTapContext } from "@/context/prizeTapProvider";
import { useUserProfileContext } from "@/context/userProfile";
import { Prize } from "@/types";
import { getAssetUrl, numberWithCommas } from "@/utils";
import Image from "next/image";
import { FC, useMemo, useState, useEffect } from "react";
import { zeroAddress } from "viem";

const RenderEnrollsCount: FC<{ count: number; max: number }> = ({
  count,
  max,
}) => {
  const remaining = max - count;

  const isRemainingPercentLessThanTen = (remaining / max) * 100 < 10;

  if (max >= 1_000_000_000) {
    return (
      <p className="text-xs text-gray100">
        {numberWithCommas(count)} people enrolled
      </p>
    );
  }

  if (isRemainingPercentLessThanTen || remaining < 5) {
    return <p className="text-xs text-[#F16E35]">{remaining} Spots remains</p>;
  }

  return (
    <p className="text-xs text-gray100">
      {`${count} / ${numberWithCommas(max)} people enrolled`}
    </p>
  );
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

  const creator = creatorName || creatorProfile?.username;

  const { openEnrollModal } = usePrizeTapContext();
  const { userProfile } = useUserProfileContext();
  const start = new Date(startAt) < new Date();

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
                  <p className="mr-3 text-base font-medium leading-[19.5px] text-white">
                    {prizeName}
                    {winnersCount > 1 && (
                      <span className="ml-1 text-gray100">
                        {" "}
                        x{winnersCount}
                      </span>
                    )}
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
              {!start ? (
                <div className="enroll-btn cursor-pointer">
                  <button
                    disabled
                    className="enroll-button rounded-[18px] p-[1px] text-sm"
                  >
                    <div className="flex h-[36px] min-w-[208px] items-center justify-center rounded-3xl">
                      <p className="text-[#8B6D8B]">Enrollment Not Started!</p>
                    </div>
                  </button>
                </div>
              ) : !winnersEntry.length && !userEntry?.txHash ? (
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

            <PermissionsCard
              constraintParams={raffle.constraintParams}
              constraints={raffle.constraints}
              pk={raffle.pk}
            />
          </div>
        </div>
        <div className="relative flex h-[40px] items-center justify-between bg-gray30 px-9">
          <div className="flex font-medium leading-[14.63px]">
            <p className="mr-1 text-xs text-gray100">
              <span className="mr-1">On</span>
              {chain.chainName}
            </p>
            <Icon iconSrc={chain.logoUrl} width="20px" height="16px" />
          </div>
          <div className="absolute left-1/2 -translate-x-1/2">
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
          <div className="flex gap-14">
            {winnersCount > 1 && (
              <span className="text-xs text-[#B5B5C6]">
                {winnersCount} Winners
              </span>
            )}{" "}
            <RenderEnrollsCount
              count={numberOfOnchainEntries}
              max={maxNumberOfEntries}
            />
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

export default RaffleCard;
