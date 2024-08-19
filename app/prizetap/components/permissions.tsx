"use client";

import { usePrizeTapContext } from "@/context/prizeTapProvider";
import { useUserProfileContext } from "@/context/userProfile";
import { getRaffleConstraintsVerifications } from "@/utils/api";
import { ClaimAndEnrollButton } from "@/components/ui/Button/button";
import Tooltip from "@/components/ui/Tooltip";
import { FC, useEffect, useMemo, useState } from "react";
import { Permission, Prize } from "@/types";
import { replacePlaceholders, shortenAddress } from "@/utils";
import { chanceAnimationOption } from "@/constants/lottieCode";
import { arrowAnimationOption } from "@/constants/lottieCode";
import Lottie from "react-lottie";
import { useWalletAccount } from "@/utils/wallet";
import ReactMarkdown from "react-markdown";
import Link from "next/link";

// const tokenImgLink = (tokenUri: string) =>
//   tokenUri
//     ? `https://ipfs.io/ipfs/QmYmSSQMHaKBByB3PcZeTWesBbp3QYJswMFZYdXs1H3rgA/${
//         Number(tokenUri.split("/")[3]) + 1
//       }.png`
//     : undefined;

const RafflePermissions: FC<{ raffle: Prize }> = ({ raffle }) => {
  const { userToken, userProfile } = useUserProfileContext();
  const [loading, setLoading] = useState(false);
  const {
    openEnrollModal,
    selectedRaffleForEnroll,
    handleUserTicketChance,
    closeEnrollModal,
    handleEnroll,
    claimOrEnrollLoading,
    claimOrEnrollWalletResponse,
    claimOrEnrollSignatureLoading,
  } = usePrizeTapContext();
  const { address } = useWalletAccount();
  const [userTickets, setUserTickets] = useState<number[]>([]);
  const [selectedUserTickets, setSelectedUserTickets] = useState<number[]>([]);
  const [userTicketList, setUserTicketList] = useState<number[]>([]);

  const maxChance = 2;

  const [permissions, SetPermissions] = useState<
    (Permission & { isVerified: boolean })[]
  >([]);

  const [selectedTicketCount, setSelectedTicketCount] = useState(0);

  useEffect(() => {
    if (userProfile && userTickets.length == 0) {
      const items = Array.from(
        { length: userProfile.prizetapWinningChanceNumber },
        (_, index) => index + 1,
      );
      setUserTickets(items);
    }
  }, [userProfile]);

  useEffect(() => {
    handleUserTicketChance("reset");
  }, []);

  useEffect(() => {
    setUserTicketList(userTickets);
  }, [userTickets]);

  const handelRemoveSelectedTicket = () => {
    if (selectedTicketCount < 1) return;
    setSelectedTicketCount((prev) => prev - 1);
    handleUserTicketChance("decrease");
    setSelectedUserTickets((prevTickets) => prevTickets.slice(0, -1));
    setUserTicketList((prevTickets) => [
      ...prevTickets,
      prevTickets.length + 1,
    ]);
  };

  const params = useMemo(
    () => JSON.parse(raffle.constraintParams),
    [raffle.constraintParams],
  );

  useEffect(() => {
    setLoading(true);
    if (!userToken) {
      setLoading(false);
      return;
    }

    getRaffleConstraintsVerifications(raffle.pk, userToken)
      .then((res) => {
        // console.log(res.constraints);
        SetPermissions(res.constraints);
      })
      .catch(() => {
        SetPermissions(
          raffle.constraints.map((constraint) => ({
            ...constraint,
            isVerified: false,
          })),
        );
      })
      .finally(() => setLoading(false));
  }, [userToken, raffle.constraints, raffle.pk, SetPermissions]);

  const handleDrop = () => {
    if (selectedTicketCount >= maxChance) {
      return;
    }
    setSelectedTicketCount((prev) => prev + 1);
    handleUserTicketChance("increase");
    const items: number[] = Array.from(
      { length: selectedTicketCount + 1 },
      (_, index) => index + 1,
    );
    setUserTicketList((prevTickets) => prevTickets.slice(0, -1));
    setSelectedUserTickets(items);
  };

  return (
    <div className="w-full">
      <div className="relative mb-8 text-center">
        <div
          className={`${
            raffle.isPrizeNft
              ? "bg-[url('/assets/images/prize-tap/nft-cover.svg')]"
              : "bg-[url('/assets/images/prize-tap/cover.svg')]"
          } mx-auto h-32 w-64 rounded-lg bg-cover`}
        />
        <img
          src={raffle.imageUrl}
          className="absolute left-1/2 top-3 max-w-[120px] -translate-x-1/2"
          alt={raffle.name}
          width={100}
        />
        <div className="mt-4 flex w-full items-center justify-center gap-2">
          <p className="text-sm font-medium text-white">{raffle.name}</p>
          <div className="h-1 w-1 rounded-full bg-gray90"></div>
          <p className="text-2xs font-medium text-gray100">
            by {raffle.creatorName}
          </p>
        </div>
      </div>

      {userProfile && (
        <div className="mb-3 flex h-[126px] w-full flex-col overflow-hidden rounded-xl border border-gray70 bg-gray60">
          {userProfile.prizetapWinningChanceNumber > 0 ? (
            <div>
              <div
                className={`flex h-8 items-center justify-center border-b border-gray70 bg-gray50 pl-2 text-xs font-medium ${selectedTicketCount >= maxChance ? "text-space-green" : "text-gray100"}`}
              >
                {selectedTicketCount >= maxChance
                  ? "You have reached the limit of using Boosts :)"
                  : "Drag & Drop more Boosts to increase your chance to win!"}
              </div>
              <div className="relative  flex h-[62px] items-center justify-between">
                <div
                  className={`relative flex items-start gap-2 ${selectedTicketCount >= maxChance && "opacity-30"} `}
                >
                  {userTicketList.slice(0, 5).map((item, index) => (
                    <div
                      className={`z-100 ${index > 0 && "-ml-[53px]"}  flex items-center justify-center`}
                      key={index}
                      onDragEnd={() => handleDrop()}
                    >
                      <img
                        src="/assets/images/prize-tap/userTicket.svg"
                        className={`${!(selectedTicketCount >= maxChance) && "cursor-pointer"}`}
                        draggable={!(selectedTicketCount >= maxChance)}
                      />
                    </div>
                  ))}
                  {userTicketList.length > 5 && (
                    <div className="absolute -right-2 -top-2 z-100  flex h-5 w-5 items-center justify-center rounded-full border border-gray90 bg-gray70 p-2 text-2xs">
                      +{userTicketList.length - 5}
                    </div>
                  )}
                </div>
                {userTicketList.length === 0 && (
                  <img
                    className="-ml-16"
                    src="/assets/images/prize-tap/emptyTicket.svg"
                  />
                )}
                <div className="cursor-none select-none">
                  <Lottie options={arrowAnimationOption}></Lottie>
                </div>
                <div
                  className=""
                  onDragEnd={() => handelRemoveSelectedTicket()}
                >
                  {selectedTicketCount == 0 ? (
                    <div className="mr-[10px]">
                      <Lottie options={chanceAnimationOption}></Lottie>
                    </div>
                  ) : (
                    <div className="flex flex-row-reverse items-end ">
                      {selectedUserTickets.map((item, index) => (
                        <img
                          key={index}
                          src="./assets/images/prize-tap/selectedTicket.svg"
                          className={`${index > 0 && "-mr-[45px]"} z-100 cursor-pointer`}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <div className="flex h-8 items-center justify-between border border-gray70 bg-gray50 px-2 text-xs font-bold text-gray100">
                {userProfile.prizetapWinningChanceNumber > 0 ? (
                  <div className="">
                    You have{" "}
                    <span className="text-[#a69fe5]">
                      {userProfile.prizetapWinningChanceNumber -
                        selectedTicketCount}
                    </span>{" "}
                    {userProfile.prizetapWinningChanceNumber === 1
                      ? "Boost"
                      : "Boosts"}
                  </div>
                ) : (
                  <p>You have no Boost</p>
                )}
                <div>{selectedTicketCount + 1}x chance</div>
              </div>
            </div>
          ) : (
            <Link href="./pass">
              <div className=" relative h-full cursor-pointer transition duration-700 ease-in-out hover:bg-gray20 hover:duration-700">
                <img
                  className="absolute -bottom-[10px] right-0"
                  src="./assets/images/noBoost.svg"
                />
                <img
                  className="absolute -bottom-[10px] right-28"
                  src="./assets/images/noBoost1.svg"
                />
                <div className="px-4 py-3">
                  <div className="flex items-center justify-between text-sm font-medium">
                    <div className="">
                      You want more chance in this raffle?!
                    </div>
                    <div className="flex items-center justify-center gap-1 ">
                      <div className="relative">
                        <div className="bg-primaryGradient2 bg-clip-text text-transparent">
                          Mint UP
                        </div>
                        <div className="absolute -mt-[2px] h-[1px] w-[65px] bg-primaryGradient2"></div>
                      </div>

                      <svg
                        width="10"
                        height="9"
                        viewBox="0 0 10 9"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M9.80474 4.03768L5.5 0L4.66668 0.999885L7.72384 3.84621L1.53261e-07 3.84621L0 5.15352L7.72388 5.15352L4.66668 8L5.5 9L9.80474 4.96209C10.0651 4.70682 10.0651 4.29295 9.80474 4.03768Z"
                          fill="url(#paint0_linear_12946_761)"
                        />
                        <defs>
                          <linearGradient
                            id="paint0_linear_12946_761"
                            x1="-0.594405"
                            y1="4.5"
                            x2="11.2811"
                            y2="4.81107"
                            gradientUnits="userSpaceOnUse"
                          >
                            <stop stopColor="#4BF2A2" />
                            <stop offset="0.522948" stopColor="#A89FE7" />
                            <stop offset="0.669499" stopColor="#E1C4F4" />
                            <stop offset="1" stopColor="#DD40CD" />
                            <stop offset="1" stopColor="#DD40CD" />
                          </linearGradient>
                        </defs>
                      </svg>
                    </div>
                  </div>
                  <div className="max-w-[256px] pt-2 text-xs font-normal leading-6 text-gray100 ">
                    You can increase your chance up to 3X by spending tickets.
                    Get ticket by holding
                    <div className="relative bg-primaryGradient2 bg-clip-text font-bold text-transparent">
                      Unitap Pass NFT
                      <div className=" bg-primaryGradient3 absolute -mt-[4px] h-[1px] w-[95px]"></div>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          )}
        </div>
      )}

      <div className="mb-3 flex h-10 w-full items-center justify-between rounded-xl bg-gray50 px-3">
        <div className="text-xs font-normal text-gray100">Connected Wallet</div>
        <div className="text-sm font-medium">{shortenAddress(address)}</div>
      </div>
      {loading ? (
        <div className="relative mt-10 animate-pulse">
          <div className="flex items-center gap-2 overflow-x-auto overflow-y-hidden text-xs">
            {Array.from(new Array(5)).map((_, index) => (
              <div
                key={index}
                className="relative inline-block h-7 w-20 flex-1 rounded-lg border border-gray70 bg-gray50 px-2 py-2"
              />
            ))}
          </div>

          <div className="relative mt-5 h-14 w-full rounded-xl border-2 border-solid border-gray70 bg-gray50 py-3 text-center"></div>
        </div>
      ) : (
        <>
          <div
            className={`flex flex-wrap items-center gap-2 text-xs text-white`}
          >
            {permissions.map((permission, key) => (
              <Tooltip
                className={
                  "rounded-lg border border-gray70 bg-gray50 px-2 py-2 transition-colors hover:bg-gray10 " +
                  (permission.isVerified ? "text-space-green" : "text-warn")
                }
                data-testid={`token-verification-modal-${raffle.pk}-${permission.name}`}
                key={key}
                text={
                  <ReactMarkdown className="markdown">
                    {replacePlaceholders(
                      (permission.isReversed
                        ? permission.negativeDescription
                        : permission.description)!,
                      params[permission.name],
                    )}
                  </ReactMarkdown>
                }
              >
                <div className="flex items-center gap-1">
                  <img
                    src={
                      permission.isVerified
                        ? "/assets/images/token-tap/check.svg"
                        : "/assets/images/token-tap/not-verified.svg"
                    }
                  />
                  {permission.isReversed && "Not "}
                  {permission.title}
                </div>
              </Tooltip>
            ))}
          </div>

          {permissions.some((item) => !item.isVerified) ? (
            <ClaimAndEnrollButton
              height="48px"
              $fontSize="14px"
              disabled={new Date(raffle.startAt) > new Date()}
              className="mt-5 !w-full"
              onClick={() => openEnrollModal(raffle, "Pre-Verify")}
            >
              <div className="relative w-full">
                <p>Meet Requirement</p>
              </div>
            </ClaimAndEnrollButton>
          ) : !raffle.userEntry?.txHash ? (
            <ClaimAndEnrollButton
              height="48px"
              $fontSize="14px"
              disabled={
                new Date(raffle.startAt) > new Date() || claimOrEnrollLoading
              }
              className="mt-5 !w-full"
              // onClick={() => openEnrollModal(raffle, "Enroll")}
              onClick={() => handleEnroll()}
            >
              <div className="relative w-full">
                {claimOrEnrollLoading ? (
                  <p>Enrolling...</p>
                ) : claimOrEnrollSignatureLoading ? (
                  <p>Preparing...</p>
                ) : claimOrEnrollWalletResponse?.state === "Retry" ? (
                  <p>Retry</p>
                ) : (
                  <p>Enroll</p>
                )}
              </div>
            </ClaimAndEnrollButton>
          ) : (
            <ClaimAndEnrollButton
              onClick={() => closeEnrollModal()}
              $width="100%"
              $fontSize="16px"
              className="!w-full"
              data-testid={`chain-claim-action-${raffle.chain.pk}`}
            >
              Enrolled
            </ClaimAndEnrollButton>
          )}
        </>
      )}
    </div>
  );
};

export default RafflePermissions;
