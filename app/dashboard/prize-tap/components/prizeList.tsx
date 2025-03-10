"use client";

import Icon from "@/components/ui/Icon";
import { useUserProfileContext } from "@/context/userProfile";
import { UserRafflesProps } from "@/types";
import { getUserRaffles } from "@/utils/api";
import { useFastRefresh } from "@/utils/hooks/refresh";
import useScrollToTop from "@/utils/hooks/scrollTop";
import RoutePath from "@/utils/routes";
import Link from "next/link";
import { useState, useCallback, useEffect, FC } from "react";
import SearchInput from "./SearchInput";
import Styles from "./content.module.scss";
import PrizeCard, { RaffleStatus } from "./prizeCard";

const PrizeTapList: FC<{ initialRaffles: UserRafflesProps[] }> = ({
  initialRaffles,
}) => {
  const { userToken } = useUserProfileContext();
  const [userRafflesLoading, setUserRafflesLoading] = useState(false);
  const [userRaffles, setUserRaffles] =
    useState<UserRafflesProps[]>(initialRaffles);

  const handleGetUserRaffles = useCallback(async () => {
    if (!userToken) return;
    try {
      const raffles = await getUserRaffles(userToken);
      setUserRaffles(raffles);
      setUserRafflesLoading(false);
    } catch (e: any) {
      setUserRafflesLoading(false);
    }
  }, [userToken]);

  useFastRefresh(() => {
    setUserRafflesLoading(true);
    handleGetUserRaffles();
  }, []);

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
        <div className="flex flex-col items-center justify-between md:flex-row">
          <SearchInput
            className="w-full md:w-1/3"
            handleSetSearchPhrase={handleSetSearchPhrase}
          />
          <div
            className={`${Styles.providerDashboardStatus} align-center mt-5 flex h-[40px] w-full select-none items-center justify-center rounded-xl border-2 border-gray30 bg-gray40 text-xs text-gray90 md:mt-0 md:w-auto`}
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
                className="absolute left-0 top-[-17px] h-[150px] sm:right-[-45px] sm:h-[80px]"
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
      </div>
    </div>
  );
};

export default PrizeTapList;
