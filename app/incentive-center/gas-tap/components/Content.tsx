"use client";

import {
  ProviderDashboardButton,
  ProviderDashboardButtonRejected,
  ProviderDashboardButtonSuccess,
} from "../../components/Buttons";
import Icon from "@/components/ui/Icon";
import SearchInput from "../../prize-tap/components/SearchInput";
import Link from "next/link";
import RoutePath from "@/utils/routes";
import { useCallback, useEffect, useState } from "react";
import { useUserProfileContext } from "@/context/userProfile";
import { getUserDonations } from "@/utils/api";
import { useRefreshWithInitial } from "@/utils/hooks/refresh";
import { FAST_INTERVAL } from "@/constants";
import {
  EvmFilters,
  MainnetFilters,
  StatusFilters,
  UserDonation,
  filterProps,
} from "@/types";
import useScrollToTop from "@/utils/hooks/scrollTop";

interface DonationProps {
  donation: UserDonation;
}

enum Status {
  Rejected = "Rejected",
  Pending = "Pending",
  Verified = "Verified",
}

const DonationCard = ({ donation }: DonationProps) => {
  const isTestnet = donation.faucet.chain.isTestnet;
  const status = donation.status;
  return (
    <div>
      <div className="w-full rounded-xl border-2 border-gray40 bg-gray30 p-4">
        <div className="flex items-center justify-between text-gray90">
          <div className="text-base; flex items-center gap-2 font-medium text-white">
            <Icon
              iconSrc={donation.faucet.gasImageUrl}
              width="30px"
              height="27px"
            />
            <p>{donation.faucet.chain.chainName}</p>
          </div>
          <div className="flex items-center justify-center gap-2 text-2xs">
            <div className="w-[50px] rounded-md bg-gray50 px-1 py-[3px] text-center">
              {donation.faucet.chain.chainType}
            </div>
            <div className="w-[50px] rounded-md bg-gray50 px-1 py-[3px] text-center">
              {isTestnet ? "Testnet" : "Mainnet"}
            </div>
          </div>
        </div>
        <div className="mt-4 flex items-center justify-between">
          <div className="text-xs text-gray90">
            <div className="mb-2">
              Currency{" "}
              <span className="ml-2 text-white">
                {" "}
                {donation.faucet.chain.nativeCurrencyName}
              </span>
            </div>
            <div>
              Refill Amount{" "}
              <span className="ml-2 text-white">{donation.value}</span>
            </div>
          </div>
          <div>
            {status == Status.Pending && (
              <ProviderDashboardButton className="animate-blinking">
                <p>Pending...</p>
              </ProviderDashboardButton>
            )}
            {status == Status.Rejected && (
              <ProviderDashboardButtonRejected>
                <p>Rejected</p>
              </ProviderDashboardButtonRejected>
            )}
            {status == Status.Verified && (
              <ProviderDashboardButtonSuccess>
                <p>Done</p>
              </ProviderDashboardButtonSuccess>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const GasTapContent = () => {
  const [userDonations, setUserDonations] = useState<UserDonation[]>([]);
  const [loading, setLoading] = useState(false);
  const { userToken } = useUserProfileContext();

  const filter: filterProps = {
    statusFilter: StatusFilters.All,
    mainnetFilter: MainnetFilters.All,
    evmFilter: EvmFilters.All,
  };

  const [selectedFilter, setSelectedFilter] = useState<filterProps>(filter);

  const [filteredItem, setFilteredItem] = useState<UserDonation[]>([]);

  const [firstCheck, setFirstCheck] = useState(false);

  const handleGetUserDonations = useCallback(async () => {
    if (!userToken) return;
    try {
      const donations = await getUserDonations(userToken);
      setUserDonations(donations.results);
      setLoading(false);
      setFirstCheck(true);
    } catch (e: any) {
      setLoading(false);
    }
  }, [userToken]);

  const handleSelectFilter = (filter: string, value: string) => {
    if (selectedFilter[filter as keyof filterProps] == value) return;
    setSelectedFilter({ ...selectedFilter, [filter]: value });
    setFilteredItem([]);
  };

  const canDisplayAll =
    selectedFilter.evmFilter === "All" &&
    selectedFilter.mainnetFilter === "All" &&
    selectedFilter.statusFilter === "All";

  const [searchPhrase, setSearchPhrase] = useState<string>("");

  const filterByPhrase = (filteredItem: UserDonation[]) => {
    if (searchPhrase) {
      setFilteredItem(
        filteredItem.filter(
          (item) =>
            item.faucet.chain.chainName
              .toLocaleLowerCase()
              .includes(searchPhrase.toLocaleLowerCase()) ||
            item.faucet.chain.chainId.includes(searchPhrase) ||
            item.value.includes(searchPhrase),
        ),
      );
    } else {
      setFilteredItem(filteredItem);
    }
  };

  useScrollToTop();

  useEffect(() => {
    if (canDisplayAll) {
      setFilteredItem(userDonations);
      filterByPhrase(userDonations);
      return;
    } else {
      let filteredItem = userDonations.filter((item) =>
        selectedFilter.statusFilter != "All"
          ? item.status === selectedFilter.statusFilter
          : item,
      );

      filteredItem = filteredItem.filter((item) =>
        selectedFilter.evmFilter != "All"
          ? item.faucet.chain.chainType === selectedFilter.evmFilter
          : item,
      );

      const isTestnet = selectedFilter.mainnetFilter === MainnetFilters.Testnet;
      filteredItem = filteredItem.filter((item) =>
        selectedFilter.mainnetFilter != "All"
          ? item.faucet.chain.isTestnet === isTestnet
          : item,
      );

      filterByPhrase(filteredItem);
    }
  }, [userDonations, selectedFilter, canDisplayAll, searchPhrase]);

  const handleSetSearchPhrase = (str: string) => {
    const debounce = setTimeout(() => {
      setSearchPhrase(str);
    }, 700);
    return () => clearTimeout(debounce);
  };

  useRefreshWithInitial(
    () => {
      setLoading(true);
      handleGetUserDonations();
    },
    FAST_INTERVAL,
    [],
  );

  return (
    <div className="min-h-[600px]">
      <div>
        <div className="flex flex-col items-center justify-between gap-2 lg:flex-row lg:gap-2">
          <SearchInput
            className="st w-full sm:max-w-[270px]"
            handleSetSearchPhrase={handleSetSearchPhrase}
          />
          <div className="flex w-full select-none flex-col gap-2 sm:w-auto lg:flex-row lg:gap-1">
            <div className="provider-dashboard__status align-center flex h-[40px] w-full items-center justify-center rounded-xl border-2 border-gray30 bg-gray40 text-xs text-gray90 md:mt-0 md:w-auto">
              <div
                className={`${
                  selectedFilter.statusFilter == StatusFilters.All &&
                  "text-gray100"
                }`}
                onClick={() => handleSelectFilter("statusFilter", "All")}
              >
                All
              </div>
              <div
                className={`${
                  selectedFilter.statusFilter == StatusFilters.Pending &&
                  "text-gray100"
                }`}
                onClick={() => handleSelectFilter("statusFilter", "Pending")}
              >
                ongoing
              </div>
              <div
                className={`${
                  selectedFilter.statusFilter == StatusFilters.Verified &&
                  "text-gray100"
                }`}
                onClick={() => handleSelectFilter("statusFilter", "Verified")}
              >
                verified
              </div>
              <div
                className={`${
                  selectedFilter.statusFilter == StatusFilters.Rejected &&
                  "text-gray100"
                }`}
                onClick={() => handleSelectFilter("statusFilter", "Rejected")}
              >
                rejected
              </div>
            </div>
            <div className="provider-dashboard__status align-center flex h-[40px] w-full items-center justify-center rounded-xl border-2 border-gray30 bg-gray40 text-xs text-gray90 md:mt-0 md:w-auto">
              <div
                className={`${
                  selectedFilter.mainnetFilter == MainnetFilters.All &&
                  "text-gray100"
                }`}
                onClick={() => handleSelectFilter("mainnetFilter", "All")}
              >
                All
              </div>
              <div
                className={`${
                  selectedFilter.mainnetFilter == MainnetFilters.Testnet &&
                  "text-gray100"
                }`}
                onClick={() => handleSelectFilter("mainnetFilter", "Testnet")}
              >
                Testnet
              </div>
              <div
                className={`${
                  selectedFilter.mainnetFilter == MainnetFilters.Mainnet &&
                  "text-gray100"
                }`}
                onClick={() => handleSelectFilter("mainnetFilter", "Mainnet")}
              >
                Mainnet
              </div>
            </div>
            <div className="provider-dashboard__status align-center flex h-[40px] w-full items-center justify-center rounded-xl border-2 border-gray30 bg-gray40 text-xs text-gray90 md:mt-0 md:w-auto">
              <div
                className={`${
                  selectedFilter.evmFilter == EvmFilters.All && "text-gray100"
                }`}
                onClick={() => handleSelectFilter("evmFilter", "All")}
              >
                All
              </div>
              <div
                className={`${
                  selectedFilter.evmFilter == EvmFilters.Evm && "text-gray100"
                }`}
                onClick={() => handleSelectFilter("evmFilter", "EVM")}
              >
                EVM
              </div>
              <div
                className={`${
                  selectedFilter.evmFilter == EvmFilters.NonEvm &&
                  "text-gray100"
                }`}
                onClick={() => handleSelectFilter("evmFilter", "NonEvm")}
              >
                nonEVM
              </div>
            </div>
          </div>
        </div>
        <div className="refill-token mt-4 flex h-auto w-full items-center justify-between overflow-hidden md:h-[78px]">
          <div className="flex w-full flex-col items-center justify-between px-7 py-5 text-white sm:flex-row">
            <div className="relative flex items-center">
              <div>
                <p className="text-base font-semibold">Refuel Gas Tap</p>{" "}
                <p className="text-sm text-gray100">
                  Fill the taps of Gas Tap to help users get started on their
                  journey.
                </p>
              </div>
              <Icon
                className="absolute right-0 top-[-17px] h-[150px] sm:right-[-45px] sm:h-[80px]"
                iconSrc="/quest/assets/images/provider-dashboard/gas-bg.png"
              />
            </div>
            <Link
              href={RoutePath.PROVIDER_GASTAP_CREATE}
              className="mt-5 flex h-[46px] w-[226px] cursor-pointer items-center justify-center rounded-[12px] border-2 border-white bg-[#0C0C17] sm:mt-0"
            >
              + Provide Gas Fee
            </Link>
          </div>
        </div>
        <div className="mt-4 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {filteredItem.length > 0 &&
            filteredItem.map((item, index) => (
              <DonationCard donation={item} key={index} />
            ))}
        </div>
        {filteredItem.length == 0 &&
          loading &&
          canDisplayAll &&
          !firstCheck && (
            <div className="mt-4 grid animate-fadeInOut grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
              <Skeleton />
              <Skeleton />
              <Skeleton />
            </div>
          )}

        {filteredItem.length == 0 && !loading && (
          <div className="w-full animate-fadeIn text-center">
            No items found{" "}
          </div>
        )}
      </div>
    </div>
  );
};

export default GasTapContent;

const Skeleton = () => {
  return (
    <div className="w-full rounded-xl border-2 border-gray40 bg-gray30 p-4">
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          <div className="h-[30px] w-[30px] rounded-md bg-gray50"></div>
          <p className="h-[30px] w-[80px] rounded-md bg-gray50"></p>
        </div>
        <div className="flex items-center justify-center gap-2">
          <div className="h-[20px] w-[50px] rounded-md bg-gray50 px-1 py-[3px]"></div>
          <div className="h-[20px] w-[50px] rounded-md bg-gray50 px-1 py-[3px]"></div>
        </div>
      </div>
      <div className="mt-4 flex items-center justify-between">
        <div>
          <div className="mb-2 h-[20px] w-[70px] rounded-md bg-gray50"></div>
          <div className="h-[20px] w-[70px] rounded-md bg-gray50"></div>
        </div>
        <div>
          <div className="h-[30px] w-[100px] rounded-md bg-gray50"></div>
        </div>
      </div>
    </div>
  );
};
