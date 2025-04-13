"use client";

import {
  ProviderDashboardButton,
  ProviderDashboardButtonCheck,
  ProviderDashboardButtonRejected,
  ProviderDashboardButtonShowDetails,
  ProviderDashboardButtonSuccess,
  ProviderDashboardButtonVerifying,
} from "../../_components/Buttons";

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
import { zeroAddress } from "viem";
import useScrollToTop from "@/utils/hooks/scrollTop";

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
    <div className="relative h-[264px] w-full select-none rounded-xl border-2 border-gray40 bg-gray30 p-4">
      <div className="provideToken-item-container">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Icon
              iconSrc={distribution.chain.logoUrl}
              width="36px"
              height="36px"
            />
            <p className="text-sm font-medium text-white">
              {distribution.token}
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
              <div className="flex h-6 w-[100px] items-center justify-center rounded-md border border-gray70 bg-gray50 text-2xs text-gray100">
                Finished
              </div>
            )}
          </div>
        </div>
        <div className="mt-2 text-2xs font-medium text-white">
          {distribution.distributor}
        </div>
        <div className="my-3 flex justify-between">
          <div className="flex items-center gap-3">
            <div className="text-2xs text-gray100">
              on {distribution.chain.chainName}
            </div>
            <Icon
              iconSrc={distribution.chain.logoUrl}
              width="14px"
              height="14px"
            />
          </div>
          <div className="flex items-center gap-3">
            <div className="text-xs text-gray80">
              {distribution.isOneTimeClaim ? "Single-Claim" : " Periodic-Claim"}
            </div>
            <Icon
              iconSrc="/assets/images/provider-dashboard/reload.svg"
              width="16px"
              height="16px"
            />
          </div>
        </div>
        <div className="pt-2">
          {isStart && !isFinished && status === Filters.Verified && (
            <div className="flex h-[48px] items-center justify-center rounded-xl bg-gray50 text-sm font-medium text-white">
              {distribution.maxNumberOfClaims -
                distribution.numberOfOnchainClaims}{" "}
              claims left
            </div>
          )}
        </div>
        <div className="absolute bottom-2 left-4 right-4">
          {isStart && isFinished && status === Filters.Verified && (
            <div className="flex h-[48px] items-center justify-center rounded-xl bg-gray50 text-sm font-medium text-white">
              {distribution.numberOfClaims} claimed
            </div>
          )}
          {status == Filters.Verified && !isFinished && (
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
                Show Details
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
    [],
  );

  const [selectedFilter, setSelectedFilter] = useState<Filters>(Filters.All);

  const handleSelectFilter = (filter: any) => {
    if (filter == selectedFilter) return;
    setFilteredItems([]);
    setSelectedFilter(filter);
  };

  const [loading, setLoading] = useState<boolean>(false);

  const [searchPhrase, setSearchPhrase] = useState<string>("");

  const [firstCheck, setFirstCheck] = useState(false);

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
      setFirstCheck(true);
      setLoading(false);
    } catch (e: any) {
      setLoading(false);
    }
  }, [userToken]);

  useScrollToTop();

  useEffect(() => {
    if (selectedFilter === Filters.All) {
      setFilteredItems(userDistributions);
    }

    if (selectedFilter === Filters.Rejected) {
      setFilteredItems(
        userDistributions.filter((item) => item.status === Filters.Rejected),
      );
    }

    // this is ongoing filter. we have no pending filter to display
    if (selectedFilter === Filters.Pending) {
      setFilteredItems(
        userDistributions.filter(
          (item) =>
            item.status === Filters.Verified &&
            new Date(item.startAt) < new Date() &&
            new Date(item.deadline) > new Date(),
        ),
      );
    }

    if (selectedFilter === Filters.Verified) {
      setFilteredItems(
        userDistributions.filter(
          (item) =>
            item.status === Filters.Verified &&
            item.status === Filters.Verified &&
            new Date(item.startAt) > new Date(),
        ),
      );
    }

    if (selectedFilter === Filters.Finished) {
      setFilteredItems(
        userDistributions.filter(
          (item) =>
            item.status === Filters.Verified &&
            new Date(item.deadline) < new Date(),
        ),
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
            item.chain.chainId.includes(searchPhrase),
        ),
      );
    }
  }, [userDistributions, selectedFilter, searchPhrase]);

  useRefreshWithInitial(
    () => {
      setLoading(true);
      handleGetUserDistribution();
    },
    FAST_INTERVAL,
    [],
  );
  return (
    <div className="min-h-[600px]">
      <div className="flex select-none flex-col items-center justify-between md:flex-row">
        <SearchInput
          className="w-full md:w-1/3"
          handleSetSearchPhrase={handleSetSearchPhrase}
        />
        <div
          className={`${Styles.provider_dashboard__status} align-center mt-5 flex h-[40px] w-full items-center justify-center rounded-xl border-2 border-gray30 bg-gray40 text-xs text-gray90 md:mt-0 md:w-auto`}
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
        className={`refill-token ${Styles.refill_token} mt-4 flex h-auto w-full items-center justify-between overflow-hidden md:h-[78px]`}
      >
        <div className="flex w-full flex-col items-center justify-between px-7 py-5 text-white sm:flex-row">
          <div className="relative flex items-center">
            <div>
              <p className="text-base font-semibold">
                Distribute a token on Token Tap
              </p>{" "}
              <p className="text-sm text-gray100">
                Give out tokens based on specific requirements.
              </p>
            </div>
            <Icon
              className="absolute left-0 top-[-17px] h-[150px] sm:right-[-45px] sm:h-[80px]"
              iconSrc="/assets/images/provider-dashboard/token-bg.png"
            />
          </div>
          <Link
            href={RoutePath.PROVIDER_TOKENTAP_CREATE}
            className="mt-5 flex h-[46px] w-[226px] cursor-pointer items-center justify-center rounded-[12px] border-2 border-white bg-[#0C0C17] sm:mt-0"
          >
            + List a New Token
          </Link>
        </div>
      </div>
      <div className="mt-4 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
        {filteredItems.length > 0 &&
          filteredItems.map((distribution, index: number) => (
            <DistributionCard key={index} distribution={distribution} />
          ))}
      </div>

      {loading &&
        filteredItems.length == 0 &&
        selectedFilter === Filters.All &&
        !firstCheck && (
          <div className="mt-4 grid animate-fadeInOut grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            <Skeleton />
            <Skeleton />
            <Skeleton />
          </div>
        )}

      {filteredItems.length === 0 && !loading && (
        <div className="animate-fadeIn text-center">
          <p>No items found.</p>
        </div>
      )}
    </div>
  );
};

export default TokenTapContent;

const Skeleton = () => {
  return (
    <div className="w-full rounded-xl border-2 border-gray40 bg-gray30 p-4">
      <div className="flex w-full items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="min-h-[40px] min-w-[40px] rounded-[50%] bg-gray50"></div>
          <div className="min-h-[20px] min-w-[50px] bg-gray50"></div>
        </div>
        <div className="min-h-[25px] min-w-[100px] rounded-lg bg-gray50"></div>
      </div>
      <div className="mt-3 min-h-[20px] w-[170px] rounded-md bg-gray50"></div>
      <div className="flex justify-between">
        <div className="mt-3 h-[15px] w-[85px] rounded-md bg-gray50"></div>
        <div className="mt-3 h-[15px] w-[85px] rounded-md bg-gray50"></div>
      </div>
      <div className="mt-4 h-[44px] w-full rounded-xl bg-gray50"></div>
      <div className="mt-8 h-[20px] w-[40px] rounded-xl bg-gray50"></div>
      <div className="mt-3 h-[50px] w-full rounded-xl bg-gray50"></div>
    </div>
  );
};
