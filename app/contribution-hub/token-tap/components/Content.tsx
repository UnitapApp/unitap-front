"use client";

import {
  ProviderDashboardButton,
  ProviderDashboardButtonCheck,
  ProviderDashboardButtonRejected,
  ProviderDashboardButtonShowDetails,
  ProviderDashboardButtonSuccess,
  ProviderDashboardButtonVerifying,
} from "../../Buttons";

import Icon from "@/components/ui/Icon";
import SearchInput from "../../prize-tap/components/SearchInput";
import Styles from "./content.module.scss";
import Link from "next/link";
import RoutePath from "@/utils/routes";
import { getUserDistributions } from "@/utils/api/provider-dashboard";
import { useRefreshWithInitial } from "@/utils/hooks/refresh";
import { FAST_INTERVAL } from "@/constants";
import { useCallback, useEffect, useState } from "react";
import { useUserProfileContext } from "@/context/userProfile";
import { UserTokenDistribution } from "@/types/provider-dashboard";
import { CardTimerTokenTap } from "./CardTimerTokenTap";

interface DistributionCardProp {
  distribution: UserTokenDistribution;
}

enum Filters {
  All = "All",
  Pending = "PENDING",
  Verified = "VERIFIED",
  Rejected = "REJECTED",
  Finished = "Finished",
}

const DistributionCard = ({ distribution }: DistributionCardProp) => {
  const [finished, setFinished] = useState<boolean>(false);
  const [isStarted, setIsStarted] = useState<boolean>(false);
  const isStart = new Date(distribution.startAt) < new Date();
  const isFinished = new Date(distribution.deadline) < new Date();
  const status = distribution.status;
  return (
    <div className="bg-gray30 border-2 border-gray40 w-full select-none p-4 rounded-xl relative h-[264px] ">
      <div className="provideToken-item-container">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Icon
              iconSrc="/assets/images/provider-dashboard/btc_lightning_logo 1.svg"
              width="36px"
              height="36px"
            />
            <p className="text-sm font-medium text-white">
              {distribution.name}
            </p>
          </div>
          <div>
            {status === Filters.Rejected && (
              <ProviderDashboardButtonRejected>
                <p>Rejected</p>
              </ProviderDashboardButtonRejected>
            )}
            {status === Filters.Pending && (
              <ProviderDashboardButtonVerifying>
                Verifying
              </ProviderDashboardButtonVerifying>
            )}
            {isStart && !isFinished && status == Filters.Verified && (
              <ProviderDashboardButton className="animate-blinking">
                <p>Ongoing...</p>
              </ProviderDashboardButton>
            )}
            {!isStart && status == Filters.Verified && (
              <ProviderDashboardButtonSuccess>
                <p>Verified</p>
              </ProviderDashboardButtonSuccess>
            )}
            {isFinished && status == Filters.Verified && (
              <div className="bg-gray50 border flex items-center justify-center border-gray70 rounded-md w-[100px] h-6 text-2xs text-gray100">
                Finished
              </div>
            )}
          </div>
        </div>
        <div className="text-2xs font-medium mt-2 text-white">
          Decentralized verification system
        </div>
        <div className="flex justify-between my-3">
          <div className="flex items-center gap-3">
            <div className="text-gray100 text-2xs">
              on {distribution.chain.chainName}
            </div>
            <Icon
              iconSrc="/assets/images/provider-dashboard/btc_lightning_logo 1.svg"
              width="14px"
              height="14px"
            />
          </div>
          <div className="flex items-center gap-3">
            <div className="text-gray80 text-xs">non-Repeatable</div>
            <Icon
              iconSrc="/assets/images/provider-dashboard/reload.svg"
              width="16px"
              height="16px"
            />
          </div>
        </div>
        <div className="pt-2">
          {isStart && isFinished && status === Filters.Verified && (
            <div className="bg-gray50 rounded-xl text-sm  font-medium text-white h-[48px] flex items-center justify-center ">
              {distribution.numberOfClaims} Spots Enrolled
            </div>
          )}

          {isStart && !isFinished && status === Filters.Verified && (
            <div className="bg-gray50 rounded-xl text-sm font-medium text-white h-[48px]  flex items-center justify-center ">
              {distribution.maxNumberOfClaims - distribution.numberOfClaims}{" "}
              Spots left
            </div>
          )}
        </div>
        <div className="absolute bottom-2 right-4 left-4">
          {status == Filters.Verified && (
            <CardTimerTokenTap
              startTime={distribution.startAt}
              FinishTime={distribution.deadline}
              finished={finished}
              setFinished={setFinished}
              setIsStarted={setIsStarted}
            />
          )}

          {status == Filters.Pending && (
            <Link
              href={RoutePath.PROVIDER_TOKENTAP_DETAILS + "/" + distribution.id}
            >
              <ProviderDashboardButtonShowDetails>
                Show Detailssss
              </ProviderDashboardButtonShowDetails>
            </Link>
          )}

          <Link
            href={
              RoutePath.PROVIDER_TOKENTAP_VERIFICATION + "/" + distribution.id
            }
          >
            {status === Filters.Rejected && (
              <ProviderDashboardButtonCheck>
                Check For Reasons
              </ProviderDashboardButtonCheck>
            )}
          </Link>
        </div>
      </div>
    </div>
  );
};

const TokenTapContent = () => {
  const { userToken } = useUserProfileContext();

  const [userDistributions, setUserDistributions] = useState<
    UserTokenDistribution[]
  >([]);

  const [filteredItems, setFilteredItems] = useState<UserTokenDistribution[]>(
    []
  );

  const [selectedFilter, setSelectedFilter] = useState<Filters>(Filters.All);

  const handleSelectFilter = (filter: any) => {
    if (filter == selectedFilter) return;
    setFilteredItems([]);
    setSelectedFilter(filter);
  };

  const [loading, setLoading] = useState<boolean>(false);

  const [searchPhrase, setSearchPhrase] = useState<string>("");

  const handleSetSearchPhrase = (str: string) => {
    const debounce = setTimeout(() => {
      setSearchPhrase(str);
    }, 700);
    return () => clearTimeout(debounce);
  };

  const handleGetUserDistribution = useCallback(async () => {
    if (!userToken) return;
    try {
      const distributions = await getUserDistributions(userToken);
      setUserDistributions(distributions);
      setLoading(false);
    } catch (e: any) {
      setLoading(false);
    }
  }, [userToken]);

  useEffect(() => {
    if (selectedFilter === Filters.All) {
      setFilteredItems(userDistributions);
    }

    if (selectedFilter === Filters.Rejected) {
      setFilteredItems(
        userDistributions.filter((item) => item.status === Filters.Rejected)
      );
    }

    // this is ongoing filter. we have no pending filter to display
    if (selectedFilter === Filters.Pending) {
      setFilteredItems(
        userDistributions.filter(
          (item) =>
            item.status === Filters.Verified &&
            new Date(item.startAt) < new Date() &&
            new Date(item.deadline) > new Date()
        )
      );
    }

    if (selectedFilter === Filters.Verified) {
      setFilteredItems(
        userDistributions.filter(
          (item) =>
            item.status === Filters.Verified &&
            item.status === Filters.Verified &&
            new Date(item.startAt) > new Date()
        )
      );
    }

    if (selectedFilter === Filters.Finished) {
      setFilteredItems(
        userDistributions.filter(
          (item) =>
            item.status === Filters.Verified &&
            new Date(item.deadline) < new Date()
        )
      );
    }
    if (searchPhrase) {
      setFilteredItems(
        filteredItems.filter(
          (item) =>
            item.chain.chainName
              .toLocaleLowerCase()
              .includes(searchPhrase.toLocaleLowerCase()) ||
            item.name
              .toLocaleLowerCase()
              .includes(searchPhrase.toLocaleLowerCase()) ||
            item.chain.chainId.includes(searchPhrase)
        )
      );
    }
  }, [userDistributions, selectedFilter, searchPhrase]);

  useRefreshWithInitial(
    () => {
      setLoading(true);
      handleGetUserDistribution();
    },
    FAST_INTERVAL,
    []
  );
  return (
    <div>
      <div className="flex flex-col md:flex-row items-center justify-between select-none">
        <SearchInput
          className="w-full md:w-1/3"
          handleSetSearchPhrase={handleSetSearchPhrase}
        />
        <div
          className={`${Styles.provider_dashboard__status} justify-center mt-5 md:mt-0 flex h-[40px] text-xs items-center align-center text-gray90 bg-gray40 border-2 border-gray30 rounded-xl w-full  md:w-auto`}
        >
          <div
            className={`${selectedFilter === Filters.All && "text-gray100"}`}
            onClick={() => handleSelectFilter(Filters.All)}
          >
            All
          </div>
          <div
            className={`${
              selectedFilter === Filters.Pending && "text-gray100"
            }`}
            onClick={() => handleSelectFilter(Filters.Pending)}
          >
            ongoing
          </div>
          <div
            className={`${
              selectedFilter === Filters.Verified && "text-gray100"
            }`}
            onClick={() => handleSelectFilter(Filters.Verified)}
          >
            verified
          </div>
          <div
            className={`${
              selectedFilter === Filters.Rejected && "text-gray100"
            }`}
            onClick={() => handleSelectFilter(Filters.Rejected)}
          >
            rejected
          </div>
          <div
            className={`${
              selectedFilter === Filters.Finished && "text-gray100"
            }`}
            onClick={() => handleSelectFilter(Filters.Finished)}
          >
            finished
          </div>
        </div>
      </div>
      <div
        className={`refill-token ${Styles.refill_token} h-auto md:h-[78px] mt-4 flex w-full justify-between overflow-hidden items-center`}
      >
        <div className="flex flex-col sm:flex-row justify-between w-full items-center py-5 px-7 text-white">
          <div className="flex items-center relative">
            <div>
              <p className="text-base font-semibold">Offer a New Token</p>{" "}
              <p className="text-sm text-gray100">
                Here you can provide Token for Token Tap.
              </p>
            </div>
            <Icon
              className="absolute left-0 sm:right-[-45px] top-[-17px]  h-[150px] sm:h-[80px]"
              iconSrc="/assets/images/provider-dashboard/token-bg.png"
            />
          </div>
          <Link
            href={RoutePath.PROVIDER_TOKENTAP_CREATE}
            className="flex mt-5 sm:mt-0 items-center justify-center cursor-pointer border-2 border-white rounded-[12px] bg-[#0C0C17] w-[226px] h-[46px]"
          >
            + Provide a New Token
          </Link>
        </div>
      </div>
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredItems.length > 0 &&
          filteredItems.map((distribution, index: number) => (
            <DistributionCard key={index} distribution={distribution} />
          ))}
      </div>

      {loading &&
        filteredItems.length == 0 &&
        selectedFilter === Filters.All && (
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 animate-fadeInOut">
            <Skeleton />
            <Skeleton />
            <Skeleton />
          </div>
        )}

      {filteredItems.length === 0 && !loading && (
        <div className="text-center animate-fadeIn">
          <p>No items found.</p>
        </div>
      )}
    </div>
  );
};

export default TokenTapContent;

const Skeleton = () => {
  return (
    <div className="bg-gray30 border-2 border-gray40 w-full p-4 rounded-xl">
      <div className="w-full flex items-center justify-between">
        <div className="flex gap-2 items-center">
          <div className="min-w-[40px] min-h-[40px] bg-gray50 rounded-[50%]"></div>
          <div className="min-w-[50px] min-h-[20px] bg-gray50"></div>
        </div>
        <div className="min-h-[25px] min-w-[100px] rounded-lg bg-gray50"></div>
      </div>
      <div className="min-h-[20px] w-[170px] rounded-md mt-3 bg-gray50"></div>
      <div className="flex justify-between">
        <div className="w-[85px] h-[15px] rounded-md mt-3 bg-gray50"></div>
        <div className="w-[85px] h-[15px] rounded-md mt-3 bg-gray50"></div>
      </div>
      <div className="w-full h-[44px] rounded-xl mt-4 bg-gray50"></div>
      <div className="w-[40px] h-[20px] rounded-xl mt-8 bg-gray50"></div>
      <div className="w-full h-[50px] rounded-xl mt-3 bg-gray50"></div>
    </div>
  );
};
