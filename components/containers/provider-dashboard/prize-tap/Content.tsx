"use client";

import { UserRafflesProps } from "@/types";
import { useEffect, useState } from "react";
import Icon from "@/components/ui/Icon";
import {
  ProviderDashboardButton,
  ProviderDashboardButtonSuccess,
  ProviderDashboardButtonVerifying,
  ProviderDashboardButtonRejected,
  ProviderDashboardButtonCheck,
  ProviderDashboardButtonShowDetails,
} from "../Buttons";
import SearchInput from "./SearchInput";
import { usePrizeOfferFormContext } from "@/context/providerDashboardContext";
import { ProviderDashboardCardTimer } from "./CardTimer";
import Styles from "./content.module.scss";
import "./content.module.scss";
import OfferPrizeForm from "./OfferPrizeForm";

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
}

const PrizeCard = ({ prize }: PrizeCardProp) => {
  const { handleCheckForReason, handleShowUserDetails } =
    usePrizeOfferFormContext();
  const diff = new Date(prize.deadline).getTime() - new Date().getTime();
  const day = Math.floor(diff / (1000 * 60 * 60 * 24));
  return (
    <div className="bg-gray30 border-2 border-gray40 w-full p-4 rounded-xl relative h-[512px] select-not">
      <div className="providePrize-item-container">
        <div className="providePrize__amountBox bg-gray20 border border-gray40 h-[288px] rounded-2xl flex flex-col items-center justify-center relative">
          <div className="providePrize__chainName absolute top-0 mt-2 w-full max-w-[100px] py-1 flex items-center justify-center bg-gray50 border border-gray70 rounded-md">
            <Icon
              className="mr-2"
              iconSrc={prize.chain.logoUrl}
              width="15px"
              height="14px"
            />
            <p className="text-gray100 text-[10px] font-medium">
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
          <div className="providePrize_stats flex justify-between my-2">
            <div className={"text-white text-[14px] font-medium"}>
              {prize.prizeName}
            </div>
            {new Date(prize.startAt) < new Date() &&
            prize.status === RaffleStatus.VERIFIED &&
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
          <div className="providePrize_creator text-[12px] text-gray90 font-medium">
            by {prize.creatorName}
          </div>
        </div>
        {prize.numberOfOnchainEntries ? (
          <div className="providePrize_Spots bg-gray50 rounded-xl text-[14px] font-medium text-white h-[48px] my-3 flex items-center justify-center">
            {prize.numberOfOnchainEntries}{" "}
            {prize.status === RaffleStatus.FINISHED
              ? " Spots Enrolled"
              : " Spots Left"}
          </div>
        ) : null}
        {prize.status === RaffleStatus.REJECTED ? (
          <div className="providePrize_timer absolute bottom-3 right-4 left-4">
            <ProviderDashboardButtonCheck
              onClick={() => handleCheckForReason(prize)}
            >
              Check For Reasons
            </ProviderDashboardButtonCheck>
          </div>
        ) : prize.status === RaffleStatus.PENDING ? (
          <div
            className="providePrize_timer absolute bottom-3 right-4 left-4"
            onClick={() => handleShowUserDetails(prize)}
          >
            <ProviderDashboardButtonShowDetails>
              Show Details
            </ProviderDashboardButtonShowDetails>
          </div>
        ) : day >= 1 ? (
          <div className="providePrize_timer absolute bottom-3 right-4 left-4">
            <p className="text-white font-medium text-[8px] font-medium mb-2 ml-1">
              {Date.now() < new Date(prize.startAt).getTime()
                ? "Starts in:"
                : "Ends in:"}
            </p>
            <div className="bg-gray50 rounded-xl px-5 rounded-xl">
              <ProviderDashboardCardTimer
                startTime={prize.startAt}
                FinishTime={prize.deadline}
              />
            </div>
          </div>
        ) : diff > 0 ? (
          <div>
            <ProviderDashboardCardTimer
              startTime={prize.startAt}
              FinishTime={prize.deadline}
            />
            <div className="providePrize_Spots absolute bottom-0 right-4 left-4 bg-gray50 rounded-xl text-[14px] font-medium text-white h-[48px] my-3 flex items-center justify-center">
              <div className="relative w-full text-center">
                <p>
                  {prize.maxNumberOfEntries - prize.numberOfOnchainEntries}{" "}
                  Spots Left
                </p>
                <Icon
                  iconSrc="assets/images/provider-dashboard/info-circle.svg"
                  width="16px"
                  height="16px"
                  className="absolute right-3 top-[2px]"
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="providePrize_timer absolute bottom-3 right-4 left-4">
            <p className="text-white font-medium text-[8px] font-medium mb-2 ml-1">
              in
            </p>
            <div className="bg-gray50 rounded-xl px-5 rounded-xl">
              <ProviderDashboardCardTimer
                startTime={prize.startAt}
                FinishTime={prize.deadline}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const PrizeTapContent = () => {
  const {
    selectNewOffer,
    handleSelectNewOffer,
    userRaffles,
    userRafflesLoading,
  } = usePrizeOfferFormContext();
  const [selectedFilter, setSelectedFilter] = useState<string>(
    RaffleStatus.ALL
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
    setSelectedFilter(filter);
  };
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
              item.prizeName.toLowerCase().includes(searchPhrase.toLowerCase()))
        )
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
              item.prizeName.toLowerCase().includes(searchPhrase.toLowerCase()))
        )
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
              item.prizeName.toLowerCase().includes(searchPhrase.toLowerCase()))
        )
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
              item.prizeName.toLowerCase().includes(searchPhrase.toLowerCase()))
        )
      );
      return;
    }
  }, [selectedFilter, userRaffles, searchPhrase]);

  return (
    <div>
      {!selectNewOffer && (
        <div>
          <div className="flex flex-col md:flex-row  items-center justify-between ">
            <SearchInput
              className="w-full md:w-1/3"
              handleSetSearchPhrase={handleSetSearchPhrase}
            />
            <div
              className={`${Styles.providerDashboardStatus} select-not justify-center mt-5 md:mt-0 flex h-[40px] text-[12px] items-center align-center text-gray90 bg-gray40 border-2 border-gray30 rounded-xl w-full  md:w-auto`}
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
            className={`${Styles.refillToken} h-auto md:h-[78px] mt-4 flex w-full justify-between overflow-hidden items-center`}
          >
            <div className="flex flex-col sm:flex-row justify-between w-full items-center py-5 px-7 text-white">
              <div className="flex items-center relative">
                <div>
                  <p className="text-[16px] font-semibold">Offer a New Prize</p>{" "}
                  <p className="text-[14px] text-gray100">
                    Here you can provide an NFT or Token for Prize Tap.
                  </p>
                </div>
                <Icon
                  className="absolute left-0 sm:right-[-45px] top-[-17px]  h-[150px] sm:h-[80px]"
                  iconSrc="/assets/images/provider-dashboard/prize-bg.png"
                />
              </div>
              <div
                onClick={() => handleSelectNewOffer(true)}
                className="flex mt-5 z-[10] sm:mt-0 items-center justify-center cursor-pointer border-2 border-white rounded-xl bg-[#0C0C17] w-[226px] h-[46px]"
              >
                + Provide a New Prize
              </div>
            </div>
          </div>
          {filteredRaffles && filteredRaffles.length > 0 && (
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredRaffles.map((item, index) => (
                <PrizeCard key={index} prize={item} />
              ))}
            </div>
          )}
          {filteredRaffles?.length == 0 && !userRafflesLoading && (
            <div className="flex items-center justify-center mt-5 text-gray100">
              No items found
            </div>
          )}
          {filteredRaffles.length == 0 &&
            userRafflesLoading &&
            selectedFilter == RaffleStatus.ALL && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 items-center justify-center mt-5 text-gray100">
                <Skeleton />
                <Skeleton />
                <Skeleton />
              </div>
            )}
        </div>
      )}

      {selectNewOffer && <OfferPrizeForm />}
    </div>
  );
};

const Skeleton = () => {
  return (
    <div className="animate-pulse">
      <div className="bg-gray30 border-2 border-gray40 w-full p-4 rounded-xl relative h-[512px] select-not">
        <div className="providePrize-item-container">
          <div className="providePrize__amountBox bg-gray20 border border-gray40 h-[288px] rounded-2xl flex flex-col items-center justify-center relative">
            <div className="providePrize__chainName absolute h-[22px] top-0 mt-2 w-full max-w-[100px] py-1 flex items-center justify-center bg-gray50 border border-gray70 rounded-md"></div>
          </div>
          <div>
            <div className="providePrize_stats flex justify-between my-2">
              <div className="text-white text-[14px] font-medium rounded bg-gray50 w-[30%] h-[20px]"></div>
              <div className="text-white text-[14px] font-medium rounded bg-gray50 w-[30%] h-[20px]"></div>
            </div>
            <div className="providePrize_creator text-[12px] text-gray90 font-medium bg-gray50 w-[30%] h-[20px] mt-5"></div>
          </div>

          <div className="absolute bottom-3 right-4 left-0">
            <div className=" absolute bottom-3 right-4 left-4 bg-gray50 w-[95%] h-[40px] rounded-xl"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrizeTapContent;
