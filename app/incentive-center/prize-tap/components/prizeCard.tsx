"use client";

import { UserRafflesProps } from "@/types";
import { useState } from "react";
import Icon from "@/components/ui/Icon";

import {
  ProviderDashboardButton,
  ProviderDashboardButtonSuccess,
  ProviderDashboardButtonVerifying,
  ProviderDashboardButtonRejected,
  ProviderDashboardButtonCheck,
  ProviderDashboardButtonShowDetails,
} from "../../components/Buttons";
import { ProviderDashboardCardTimer } from "./CardTimer";
import Styles from "./content.module.scss";
import "./content.module.scss";
import WinnersModal from "./Modals/winnersModal";
import RoutePath from "@/utils/routes";
import Link from "next/link";

export type PrizeCardProp = {
  prize: UserRafflesProps;
};

export enum RaffleStatus {
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
    <div className="relative h-[512px] w-full animate-fadeIn select-none rounded-xl border-2 border-gray40 bg-gray30 p-4">
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
          <div>
            {/* <RefundRemainingPrize /> */}
            <Link
              className="absolute bottom-3 left-4 right-4"
              href={RoutePath.PROVIDER_PRIZETAP_VERIFICATION + "/" + prize.pk}
            >
              <ProviderDashboardButtonCheck>
                Check For Reasons
              </ProviderDashboardButtonCheck>
            </Link>
          </div>
        ) : prize.status === RaffleStatus.PENDING ? (
          <div>
            {/* {new Date(prize.deadline) < new Date() &&
              <RefundRemainingPrize />
            } */}
            <Link
              className="absolute bottom-3 left-4 right-4"
              href={RoutePath.PROVIDER_PRIZETAP_DETAILS + "/" + prize.pk}
            >
              <ProviderDashboardButtonShowDetails>
                Show Details
              </ProviderDashboardButtonShowDetails>
            </Link>
          </div>
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

// const RefundRemainingPrize = () => {
//   return <div className="w-full flex items-center bg-gray50 justify-center h-12 rounded-xl border border-gray70 text-xs text-gray100 mt-7 font-medium cursor-pointer">Refound your prize</div>
// }

export default PrizeCard;
