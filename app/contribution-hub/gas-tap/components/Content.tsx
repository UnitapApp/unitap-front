"use client";

import {
  ProviderDashboardButton,
  ProviderDashboardButtonRejected,
  ProviderDashboardButtonSuccess,
} from "../../Buttons";
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
      <div className="bg-gray30 border-2 border-gray40 w-full p-4 rounded-xl">
        <div className="flex justify-between items-center text-gray90">
          <div className="flex items-center text-white gap-2 font-medium text-base;">
            <Icon
              iconSrc={donation.faucet.gasImageUrl}
              width="30px"
              height="27px"
            />
            <p>{donation.faucet.chain.chainName}</p>
          </div>
          <div className="flex gap-2 text-2xs items-center justify-center">
            <div className="text-center w-[50px] bg-gray50 px-1 py-[3px] rounded-md">
              {donation.faucet.chain.chainType}
            </div>
            <div className="text-center w-[50px] bg-gray50 px-1 py-[3px] rounded-md">
              {isTestnet ? "Testnet" : "Mainnet"}
            </div>
          </div>
        </div>
        <div className="flex mt-4 justify-between items-center">
          <div className="text-gray90 text-xs">
            <div className="mb-2">
              Currency{" "}
              <span className="text-white ml-2">
                {" "}
                {donation.faucet.chain.nativeCurrencyName}
              </span>
            </div>
            <div>
              Refill Amount{" "}
              <span className="text-white ml-2">{donation.value}</span>
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
            item.value.includes(searchPhrase)
        )
      );
    } else {
      setFilteredItem(filteredItem);
    }
  };

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });

    return () => { }
  }, [])


  useEffect(() => {
    if (canDisplayAll) {
      setFilteredItem(userDonations);
      filterByPhrase(userDonations);
      return;
    } else {
      let filteredItem = userDonations.filter((item) =>
        selectedFilter.statusFilter != "All"
          ? item.status === selectedFilter.statusFilter
          : item
      );

      filteredItem = filteredItem.filter((item) =>
        selectedFilter.evmFilter != "All"
          ? item.faucet.chain.chainType === selectedFilter.evmFilter
          : item
      );

      const isTestnet = selectedFilter.mainnetFilter === MainnetFilters.Testnet;
      filteredItem = filteredItem.filter((item) =>
        selectedFilter.mainnetFilter != "All"
          ? item.faucet.chain.isTestnet === isTestnet
          : item
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
    []
  );

  return (
    <div className="min-h-[600px]">
      <div>
        <div className="flex flex-col lg:flex-row  items-center gap-2 lg:gap-2 justify-between">
          <SearchInput
            className="w-full  sm:max-w-[270px] st"
            handleSetSearchPhrase={handleSetSearchPhrase}
          />
          <div className="flex flex-col lg:flex-row gap-2 lg:gap-1 w-full sm:w-auto select-none">
            <div className="provider-dashboard__status justify-center md:mt-0 flex h-[40px] text-xs items-center align-center text-gray90 bg-gray40 border-2 border-gray30 rounded-xl w-full  md:w-auto">
              <div
                className={`${selectedFilter.statusFilter == StatusFilters.All &&
                  "text-gray100"
                  }`}
                onClick={() => handleSelectFilter("statusFilter", "All")}
              >
                All
              </div>
              <div
                className={`${selectedFilter.statusFilter == StatusFilters.Pending &&
                  "text-gray100"
                  }`}
                onClick={() => handleSelectFilter("statusFilter", "Pending")}
              >
                ongoing
              </div>
              <div
                className={`${selectedFilter.statusFilter == StatusFilters.Verified &&
                  "text-gray100"
                  }`}
                onClick={() => handleSelectFilter("statusFilter", "Verified")}
              >
                verified
              </div>
              <div
                className={`${selectedFilter.statusFilter == StatusFilters.Rejected &&
                  "text-gray100"
                  }`}
                onClick={() => handleSelectFilter("statusFilter", "Rejected")}
              >
                rejected
              </div>
            </div>
            <div className="provider-dashboard__status justify-center md:mt-0 flex h-[40px] text-xs items-center align-center text-gray90 bg-gray40 border-2 border-gray30 rounded-xl w-full  md:w-auto">
              <div
                className={`${selectedFilter.mainnetFilter == MainnetFilters.All &&
                  "text-gray100"
                  }`}
                onClick={() => handleSelectFilter("mainnetFilter", "All")}
              >
                All
              </div>
              <div
                className={`${selectedFilter.mainnetFilter == MainnetFilters.Testnet &&
                  "text-gray100"
                  }`}
                onClick={() => handleSelectFilter("mainnetFilter", "Testnet")}
              >
                Testnet
              </div>
              <div
                className={`${selectedFilter.mainnetFilter == MainnetFilters.Mainnet &&
                  "text-gray100"
                  }`}
                onClick={() => handleSelectFilter("mainnetFilter", "Mainnet")}
              >
                Mainnet
              </div>
            </div>
            <div className="provider-dashboard__status  justify-center md:mt-0 flex h-[40px] text-xs items-center align-center text-gray90 bg-gray40 border-2 border-gray30 rounded-xl w-full  md:w-auto">
              <div
                className={`${selectedFilter.evmFilter == EvmFilters.All && "text-gray100"
                  }`}
                onClick={() => handleSelectFilter("evmFilter", "All")}
              >
                All
              </div>
              <div
                className={`${selectedFilter.evmFilter == EvmFilters.Evm && "text-gray100"
                  }`}
                onClick={() => handleSelectFilter("evmFilter", "EVM")}
              >
                EVM
              </div>
              <div
                className={`${selectedFilter.evmFilter == EvmFilters.NonEvm &&
                  "text-gray100"
                  }`}
                onClick={() => handleSelectFilter("evmFilter", "NonEvm")}
              >
                nonEVM
              </div>
            </div>
          </div>
        </div>
        <div className="refill-token h-auto md:h-[78px] mt-4 flex w-full justify-between overflow-hidden items-center">
          <div className="flex flex-col sm:flex-row justify-between w-full items-center py-5 px-7 text-white">
            <div className="flex items-center relative">
              <div>
                <p className="text-base font-semibold">Refuel Gas Tap</p>{" "}
                <p className="text-sm text-gray100">
                  Fill the taps of Gas Tap to help users get started on their
                  journey.
                </p>
              </div>
              <Icon
                className="absolute right-0 sm:right-[-45px] top-[-17px]  h-[150px] sm:h-[80px]"
                iconSrc="/assets/images/provider-dashboard/gas-bg.png"
              />
            </div>
            <Link
              href={RoutePath.PROVIDER_GASTAP_CREATE}
              className="flex mt-5 sm:mt-0 items-center justify-center cursor-pointer border-2 border-white rounded-[12px] bg-[#0C0C17] w-[226px] h-[46px]"
            >
              + Provide Gas Fee
            </Link>
          </div>
        </div>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredItem.length > 0 &&
            filteredItem.map((item, index) => (
              <DonationCard donation={item} key={index} />
            ))}
        </div>
        {filteredItem.length == 0 && loading && canDisplayAll && !firstCheck && (
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 animate-fadeInOut">
            <Skeleton />
            <Skeleton />
            <Skeleton />
          </div>
        )}

        {filteredItem.length == 0 && !loading && (
          <div className="w-full text-center animate-fadeIn">
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
    <div className="bg-gray30 border-2 border-gray40 w-full p-4 rounded-xl">
      <div className="flex justify-between items-center">
        <div className="flex gap-2">
          <div className="w-[30px] h-[30px] bg-gray50 rounded-md"></div>
          <p className="w-[80px] h-[30px] bg-gray50 rounded-md"></p>
        </div>
        <div className="flex gap-2 items-center justify-center">
          <div className="h-[20px] w-[50px] bg-gray50 px-1 py-[3px] rounded-md"></div>
          <div className="h-[20px] w-[50px] bg-gray50 px-1 py-[3px] rounded-md"></div>
        </div>
      </div>
      <div className="flex mt-4 justify-between items-center">
        <div>
          <div className="mb-2 w-[70px] h-[20px] bg-gray50 rounded-md"></div>
          <div className="w-[70px] h-[20px] bg-gray50 rounded-md"></div>
        </div>
        <div>
          <div className="w-[100px] h-[30px] bg-gray50 rounded-md"></div>
        </div>
      </div>
    </div>
  );
};
