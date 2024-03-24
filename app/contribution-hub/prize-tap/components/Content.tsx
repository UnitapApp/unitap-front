"use client";

import { UserRafflesProps } from "@/types";
import { useCallback, useEffect, useState } from "react";
import Icon from "@/components/ui/Icon";

import {
  ProviderDashboardButton,
  ProviderDashboardButtonSuccess,
  ProviderDashboardButtonVerifying,
  ProviderDashboardButtonRejected,
  ProviderDashboardButtonCheck,
  ProviderDashboardButtonShowDetails,
} from "../../components/Buttons";
import SearchInput from "./SearchInput";
import { ProviderDashboardCardTimer } from "./CardTimer";
import Styles from "./content.module.scss";
import "./content.module.scss";
import WinnersModal from "./Modals/winnersModal";
import RoutePath from "@/utils/routes";
import Link from "next/link";
import { useUserProfileContext } from "@/context/userProfile";
import { getUserRaffles } from "@/utils/api";
import { useRefreshWithInitial } from "@/utils/hooks/refresh";
import { FAST_INTERVAL } from "@/constants";
import useScrollToTop from "@/utils/hooks/scrollTop";

interface PrizeCardProp {
  prize: UserRafflesProps;
}

enum RaffleStatus {
  ONGOING = "Ongoing",
  PENDING = "PENDING",
  VERIFIED = "VERIFIED",
  FINISHED = "Finished",
  REJECTED = "REJECTED",
  ALL = "all",
  WS = "WS",
}

const PrizeCard = ({ prize }: PrizeCardProp) => {
  const [winnersResultRaffle, setWinnersResultRaffle] =
    useState<UserRafflesProps | null>(null);

  const handleWinnersResult = (raffle: UserRafflesProps | null) => {
    setWinnersResultRaffle(raffle);
  };

  const diff = new Date(prize.deadline).getTime() - new Date().getTime();
  const day = Math.floor(diff / (1000 * 60 * 60 * 24));
  return (
    <div className="select-not relative h-[512px] w-full animate-fadeIn rounded-xl border-2 border-gray40 bg-gray30 p-4">
      <WinnersModal
        handleWinnersResult={handleWinnersResult}
        winnersResultRaffle={winnersResultRaffle}
      />
      <div className="providePrize-item-container">
        <div className="providePrize__amountBox relative flex h-[288px] flex-col items-center justify-center rounded-2xl border border-gray40 bg-gray20">
          <div className="providePrize__chainName absolute top-0 mt-2 flex w-full max-w-[100px] items-center justify-center rounded-md border border-gray70 bg-gray50 py-1">
            <Icon
              className="mr-2"
              iconSrc={prize.chain.logoUrl}
              width="15px"
              height="14px"
            />
            <p className="text-2xs font-medium text-gray100">
              on {prize.chain.chainName}
            </p>
          </div>
          <div
            className={`${Styles.providePrize__amount} flex items-center gap-2`}
            data-amount={prize.prizeName}
          >
            <p>{prize.prizeName}</p>{" "}
            <Icon
              iconSrc={prize.chain.logoUrl}
              width="25.8px"
              height="39.9px"
            />
          </div>
        </div>
        <div>
          <div className="providePrize_stats my-2 flex justify-between">
            <div className={"text-sm font-medium text-white"}>
              {prize.prizeName}
            </div>
            {new Date(prize.startAt) < new Date() &&
            (prize.status === RaffleStatus.VERIFIED ||
              prize.status === RaffleStatus.WS) &&
            diff > 0 ? (
              <ProviderDashboardButton className="animate-blinking">
                <p>Ongoing...</p>
              </ProviderDashboardButton>
            ) : prize.status === RaffleStatus.VERIFIED && diff > 0 ? (
              <ProviderDashboardButtonSuccess>
                Verified
              </ProviderDashboardButtonSuccess>
            ) : prize.status === RaffleStatus.PENDING ? (
              <ProviderDashboardButtonVerifying>
                Verifying
              </ProviderDashboardButtonVerifying>
            ) : prize.status !== RaffleStatus.PENDING &&
              prize.status !== RaffleStatus.REJECTED &&
              diff <= 0 ? (
              <ProviderDashboardButtonVerifying>
                Finished
              </ProviderDashboardButtonVerifying>
            ) : (
              <ProviderDashboardButtonRejected>
                Rejected
              </ProviderDashboardButtonRejected>
            )}
          </div>
          <div className="providePrize_creator text-xs font-medium text-gray90">
            by {prize.creatorName}
          </div>
        </div>
        {prize.status === RaffleStatus.REJECTED ? (
          <Link
            className="absolute bottom-3 left-4 right-4"
            href={RoutePath.PROVIDER_PRIZETAP_VERIFICATION + "/" + prize.pk}
          >
            <ProviderDashboardButtonCheck>
              Check For Reasons
            </ProviderDashboardButtonCheck>
          </Link>
        ) : prize.status === RaffleStatus.PENDING ? (
          <Link
            className="absolute bottom-3 left-4 right-4"
            href={RoutePath.PROVIDER_PRIZETAP_DETAILS + "/" + prize.pk}
          >
            <ProviderDashboardButtonShowDetails>
              Show Details
            </ProviderDashboardButtonShowDetails>
          </Link>
        ) : day >= 1 ||
          (prize.status == RaffleStatus.VERIFIED &&
            new Date(prize.startAt) > new Date() &&
            new Date(prize.deadline) < new Date()) ? (
          <div className="providePrize_timer absolute bottom-3 left-4 right-4">
            {prize.numberOfOnchainEntries ? (
              <div className="providePrize_Spots my-3 flex h-[48px] items-center justify-center rounded-xl bg-gray50 text-sm font-medium text-white">
                {prize.maxNumberOfEntries - prize.numberOfOnchainEntries}{" "}
                {prize.status === RaffleStatus.FINISHED
                  ? " Spots Enrolled"
                  : " Spots Left"}
              </div>
            ) : null}
            <p className="mb-2 ml-1 text-[8px] font-medium text-white">
              {Date.now() < new Date(prize.startAt).getTime()
                ? "Starts in:"
                : "Ends in:"}
            </p>

            <div className="rounded-xl bg-gray50 px-5">
              <ProviderDashboardCardTimer
                startTime={prize.startAt}
                FinishTime={prize.deadline}
              />
            </div>
          </div>
        ) : diff > 0 && Date.now() > new Date(prize.startAt).getTime() ? (
          <div>
            <ProviderDashboardCardTimer
              startTime={prize.startAt}
              FinishTime={prize.deadline}
            />
            <div className="providePrize_Spots absolute bottom-0 left-4 right-4 my-3 flex h-[48px] items-center justify-center rounded-xl bg-gray50 text-sm font-medium text-white">
              <div className="relative w-full text-center">
                <p>
                  {prize.maxNumberOfEntries - prize.numberOfOnchainEntries}{" "}
                  Spots Left
                </p>
                <Icon
                  iconSrc="/assets/images/provider-dashboard/info-circle.svg"
                  width="16px"
                  height="16px"
                  className="absolute right-3 top-[2px]"
                />
              </div>
            </div>
          </div>
        ) : diff > 0 && prize.status == RaffleStatus.VERIFIED ? (
          <div className="providePrize_timer absolute bottom-3 left-4 right-4">
            <p className="mb-2 ml-1 text-[8px] font-medium text-white">
              Starts in:
            </p>
            <div className="rounded-xl bg-gray50 px-5">
              <ProviderDashboardCardTimer
                startTime={prize.startAt}
                FinishTime={prize.deadline}
              />
            </div>
          </div>
        ) : (
          <div className="providePrize_timer absolute bottom-3 left-4 right-4">
            <div className="providePrize_Spots my-3 flex h-[48px] items-center justify-center rounded-xl bg-gray50 text-sm font-medium text-white">
              <p>
                {prize.numberOfOnchainEntries}{" "}
                {prize.numberOfOnchainEntries > 1 ? "spots" : "spot"} Enrolled
              </p>
            </div>
            <div
              onClick={() => handleWinnersResult(prize)}
              className="flex h-[48px] cursor-pointer items-center justify-center rounded-xl border border-gray70 bg-gray50 text-2xs font-medium text-gray100"
            >
              <p>
                {prize.numberOfOnchainEntries >= 1 &&
                !prize.winnerEntries?.length
                  ? "Raffle is being processed"
                  : "Check Winners"}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const PrizeTapContent = () => {
  const { userToken } = useUserProfileContext();
  const [userRafflesLoading, setUserRafflesLoading] = useState(false);
  const [userRaffles, setUserRaffles] = useState<UserRafflesProps[]>([]);
  const [firstCheck, setFirstCheck] = useState(false);
  const handleGetUserRaffles = useCallback(async () => {
    if (!userToken) return;
    try {
      const raffles = await getUserRaffles(userToken);
      setUserRaffles(raffles);
      setFirstCheck(true);
      setUserRafflesLoading(false);
    } catch (e: any) {
      setUserRafflesLoading(false);
    }
  }, [userToken]);

  useRefreshWithInitial(
    () => {
      setUserRafflesLoading(true);
      handleGetUserRaffles();
    },
    FAST_INTERVAL,
    [],
  );

  const [selectedFilter, setSelectedFilter] = useState<string>(
    RaffleStatus.ALL,
  );
  const [searchPhrase, setSearchPhrase] = useState<string>("");

  const handleSetSearchPhrase = (str: string) => {
    const debounce = setTimeout(() => {
      setSearchPhrase(str);
    }, 700);
    return () => clearTimeout(debounce);
  };

  const [filteredRaffles, setFilteredRaffle] = useState<UserRafflesProps[]>([]);

  const handleSelectFilter = (filter: string) => {
    if (filter == selectedFilter) return;
    setFilteredRaffle([]);
    setSelectedFilter(filter);
  };

  useScrollToTop();

  useEffect(() => {
    if (selectedFilter == RaffleStatus.ONGOING) {
      setFilteredRaffle(
        userRaffles.filter(
          (item) =>
            (!selectedFilter ||
              (item.status === RaffleStatus.VERIFIED &&
                new Date(item.startAt) < new Date())) &&
            new Date(item.deadline) > new Date() &&
            (!searchPhrase ||
              item.prizeName
                .toLowerCase()
                .includes(searchPhrase.toLowerCase())),
        ),
      );
      return;
    }

    if (selectedFilter == RaffleStatus.FINISHED) {
      setFilteredRaffle(
        userRaffles.filter(
          (item) =>
            (!selectedFilter ||
              (new Date(item.deadline) < new Date() &&
                item.status !== RaffleStatus.REJECTED &&
                item.status !== RaffleStatus.PENDING)) &&
            (!searchPhrase ||
              item.prizeName
                .toLowerCase()
                .includes(searchPhrase.toLowerCase())),
        ),
      );
      return;
    }

    if (selectedFilter === RaffleStatus.VERIFIED) {
      setFilteredRaffle(
        userRaffles.filter(
          (item) =>
            (!selectedFilter ||
              (new Date(item.startAt) > new Date() &&
                item.status === RaffleStatus.VERIFIED)) &&
            (!searchPhrase ||
              item.prizeName
                .toLowerCase()
                .includes(searchPhrase.toLowerCase())),
        ),
      );
      return;
    }

    if (
      selectedFilter != RaffleStatus.ONGOING &&
      selectedFilter != RaffleStatus.VERIFIED
    ) {
      setFilteredRaffle(
        userRaffles.filter(
          (item) =>
            (!selectedFilter ||
              selectedFilter === RaffleStatus.ALL ||
              item.status === selectedFilter) &&
            (!searchPhrase ||
              item.prizeName
                .toLowerCase()
                .includes(searchPhrase.toLowerCase())),
        ),
      );
      return;
    }
  }, [selectedFilter, userRaffles, searchPhrase]);

  return (
    <div className="min-h-[600px]">
      <div>
        <div className="flex flex-col items-center  justify-between md:flex-row ">
          <SearchInput
            className="w-full md:w-1/3"
            handleSetSearchPhrase={handleSetSearchPhrase}
          />
          <div
            className={`${Styles.providerDashboardStatus} select-not align-center mt-5 flex h-[40px] w-full items-center justify-center rounded-xl border-2 border-gray30 bg-gray40 text-xs text-gray90 md:mt-0  md:w-auto`}
          >
            <div
              className={`${
                RaffleStatus.ALL == selectedFilter ? "text-gray100" : ""
              }`}
              onClick={() => handleSelectFilter(RaffleStatus.ALL)}
            >
              All
            </div>
            <div
              className={`${
                RaffleStatus.ONGOING == selectedFilter ? "text-gray100" : ""
              }`}
              onClick={() => handleSelectFilter(RaffleStatus.ONGOING)}
            >
              ongoing
            </div>
            <div
              className={`${
                RaffleStatus.VERIFIED == selectedFilter ? "text-gray100" : ""
              }`}
              onClick={() => handleSelectFilter(RaffleStatus.VERIFIED)}
            >
              verified
            </div>
            <div
              className={`${
                RaffleStatus.REJECTED == selectedFilter ? "text-gray100" : ""
              }`}
              onClick={() => handleSelectFilter(RaffleStatus.REJECTED)}
            >
              rejected
            </div>
            <div
              className={`${
                RaffleStatus.FINISHED == selectedFilter ? "text-gray100" : ""
              }`}
              onClick={() => handleSelectFilter(RaffleStatus.FINISHED)}
            >
              finished
            </div>
          </div>
        </div>
        <div
          className={`${Styles.refillToken} mt-4 flex h-auto w-full items-center justify-between overflow-hidden md:h-[78px]`}
        >
          <div className="flex w-full flex-col items-center justify-between px-7 py-5 text-white sm:flex-row">
            <div className="relative flex items-center">
              <div>
                <p className="text-base font-semibold">
                  Create a Raffle on Prize Tap
                </p>{" "}
                <p className="text-sm text-gray100">
                  Hold raffles and give out prizes based on specific
                  requirements.
                </p>
              </div>
              <Icon
                className="absolute left-0 top-[-17px] h-[150px]  sm:right-[-45px] sm:h-[80px]"
                iconSrc="/assets/images/provider-dashboard/prize-bg.png"
              />
            </div>
            <Link
              href={RoutePath.PROVIDER_PRIZETAP_CREATE}
              className="z-[10] mt-5 flex h-[46px] w-[226px] cursor-pointer items-center justify-center rounded-xl border-2 border-white bg-[#0C0C17] sm:mt-0"
            >
              + Set Up a New Raffle
            </Link>
          </div>
        </div>
        {filteredRaffles && filteredRaffles.length > 0 && (
          <div className="mt-4 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            {filteredRaffles.map((item, index) => (
              <PrizeCard key={index} prize={item} />
            ))}
          </div>
        )}
        {filteredRaffles?.length == 0 && !userRafflesLoading && (
          <div className="mt-5 flex animate-fadeIn items-center justify-center text-gray100">
            No items found
          </div>
        )}
        {filteredRaffles.length == 0 &&
          userRafflesLoading &&
          selectedFilter == RaffleStatus.ALL &&
          !firstCheck && (
            <div className="mt-5 grid grid-cols-1 items-center justify-center gap-5 text-gray100 md:grid-cols-2 lg:grid-cols-3">
              <Skeleton />
              <Skeleton />
              <Skeleton />
            </div>
          )}
      </div>
    </div>
  );
};

const Skeleton = () => {
  return (
    <div className="animate-pulse">
      <div className="select-not relative h-[512px] w-full rounded-xl border-2 border-gray40 bg-gray30 p-4">
        <div className="providePrize-item-container">
          <div className="providePrize__amountBox relative flex h-[288px] flex-col items-center justify-center rounded-2xl border border-gray40 bg-gray20">
            <div className="providePrize__chainName absolute top-0 mt-2 flex h-[22px] w-full max-w-[100px] items-center justify-center rounded-md border border-gray70 bg-gray50 py-1"></div>
          </div>
          <div>
            <div className="providePrize_stats my-2 flex justify-between">
              <div className="h-[20px] w-[30%] rounded bg-gray50 text-sm font-medium text-white"></div>
              <div className="h-[20px] w-[30%] rounded bg-gray50 text-sm font-medium text-white"></div>
            </div>
            <div className="providePrize_creator mt-5 h-[20px] w-[30%] bg-gray50 text-xs font-medium text-gray90"></div>
          </div>

          <div className="absolute bottom-3 left-0 right-4">
            <div className=" absolute bottom-3 left-4 right-4 h-[40px] w-[95%] rounded-xl bg-gray50"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrizeTapContent;
