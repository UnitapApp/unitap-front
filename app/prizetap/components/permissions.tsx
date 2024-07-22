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

// const tokenImgLink = (tokenUri: string) =>
//   tokenUri
//     ? `https://ipfs.io/ipfs/QmYmSSQMHaKBByB3PcZeTWesBbp3QYJswMFZYdXs1H3rgA/${
//         Number(tokenUri.split("/")[3]) + 1
//       }.png`
//     : undefined;

const RafflePermissions: FC<{ raffle: Prize }> = ({ raffle }) => {
  const { userToken, userProfile } = useUserProfileContext();
  const [loading, setLoading] = useState(false);
  const { openEnrollModal, selectedRaffleForEnroll, handleUserTicketChance } =
    usePrizeTapContext();
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
            <div className="" onDragEnd={() => handelRemoveSelectedTicket()}>
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
            <button
              disabled
              className="mt-5 w-full rounded-xl border-2 border-solid border-warn bg-[#392821] py-3 text-center text-warn"
            >
              Complete requirements first!
            </button>
          ) : (
            <ClaimAndEnrollButton
              height="48px"
              $fontSize="14px"
              disabled={new Date(raffle.startAt) > new Date()}
              className="mt-5 !w-full"
              onClick={() => openEnrollModal(raffle, "Enroll")}
            >
              <div className="relative w-full">
                <p>Enroll</p>
              </div>
            </ClaimAndEnrollButton>
          )}
        </>
      )}
    </div>
  );
};

export default RafflePermissions;
