"use client";

import {
  ProviderDashboardButton,
  ProviderDashboardButtonCheck,
  ProviderDashboardButtonRejected,
  ProviderDashboardButtonSuccess,
  ProviderDashboardButtonVerifying,
} from "../../Buttons";

import Icon from "@/components/ui/Icon";
import SearchInput from "@/app/contribution-hub/prize-tap/components/SearchInput";
import { ProviderDashboardCardTimer } from "@/app/contribution-hub/prize-tap/components/CardTimer";
import Styles from "./content.module.scss";
import Link from "next/link";
import RoutePath from "@/utils/routes";
import { getUserDistributions } from "@/utils/api/provider-dashboard";
import { useRefreshWithInitial } from "@/utils/hooks/refresh";
import { FAST_INTERVAL } from "@/constants";
import { useCallback, useState } from "react";
import { useUserProfileContext } from "@/context/userProfile";
import { UserTokenDistribution } from "@/types/provider-dashboard";
import { CardTimerTokenTap } from "./CardTimerTokenTap";

const handleSetSearchPhrase = () => {};

interface DistributionCardProp {
  distribution: UserTokenDistribution;
}

const DistributionCard = ({ distribution }: DistributionCardProp) => {
  const [finished, setFinished] = useState<boolean>(false);
  const [isStarted, setIsStarted] = useState<boolean>(false);
  return (
    <div className="bg-gray30 border-2 border-gray40 w-full p-4 rounded-xl relative h-[264px]">
      <div className="provideToken-item-container">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Icon
              iconSrc="/assets/images/provider-dashboard/btc_lightning_logo 1.svg"
              width="36px"
              height="36px"
            />
            <p className="text-[14px] font-medium text-white">
              {distribution.name}
            </p>
          </div>
          <div>
            {isStarted && !finished && (
              <ProviderDashboardButton className="animate-blinking">
                <p>Ongoing...</p>
              </ProviderDashboardButton>
            )}
            {finished && (
              <div className="bg-gray50 border flex items-center justify-center border-gray70 rounded-md w-[100px] h-6 text-[10px] text-gray100">
                Finished
              </div>
            )}
          </div>
        </div>
        <div className="text-[10px] font-medium mt-2 text-white">
          Decentralized verification system
        </div>
        <div className="flex justify-between my-3">
          <div className="flex items-center gap-3">
            <div className="text-gray100 text-[10px]">
              on {distribution.chain.chainName}
            </div>
            <Icon
              iconSrc="/assets/images/provider-dashboard/btc_lightning_logo 1.svg"
              width="14px"
              height="14px"
            />
          </div>
          <div className="flex items-center gap-3">
            <div className="text-gray80 text-[10px]">non-Repeatable</div>
            <Icon
              iconSrc="/assets/images/provider-dashboard/reload.svg"
              width="14px"
              height="14px"
            />
          </div>
        </div>
        <div className="provideToken_Spots bg-gray50 rounded-xl text-[14px] font-medium text-white h-[48px] my-3 flex items-center justify-center ">
          30 Spots Left
        </div>
        <div className="provideToken_timer absolute bottom-2 right-4 left-4">
          <CardTimerTokenTap
            startTime={distribution.startAt}
            FinishTime={distribution.deadline}
            finished={finished}
            setFinished={setFinished}
            setIsStarted={setIsStarted}
          />
        </div>
      </div>
    </div>
  );
};

const TokenTapContent = () => {
  const [userDistributions, setUserDistributions] = useState<
    UserTokenDistribution[] | undefined
  >();

  const { userToken } = useUserProfileContext();

  const handleGetUserDistribution = useCallback(async () => {
    if (!userToken) return;
    const res = await getUserDistributions(userToken);
    console.log(res);
    setUserDistributions(res);
  }, [userToken]);

  useRefreshWithInitial(
    () => {
      // setUserRafflesLoading(true);
      handleGetUserDistribution();
    },
    FAST_INTERVAL,
    []
  );
  return (
    <>
      <div className="flex flex-col md:flex-row items-center justify-between ">
        <SearchInput
          className="w-full md:w-1/3"
          handleSetSearchPhrase={handleSetSearchPhrase}
        />
        <div
          className={`${Styles.provider_dashboard__status} justify-center mt-5 md:mt-0 flex h-[40px] text-[12px] items-center align-center text-gray90 bg-gray40 border-2 border-gray30 rounded-xl w-full  md:w-auto`}
        >
          <div>All</div>
          <div>ongoing</div>
          <div>verified</div>
          <div>rejected</div>
          <div>finished</div>
        </div>
      </div>
      <div
        className={`refill-token ${Styles.refill_token} h-auto md:h-[78px] mt-4 flex w-full justify-between overflow-hidden items-center`}
      >
        <div className="flex flex-col sm:flex-row justify-between w-full items-center py-5 px-7 text-white">
          <div className="flex items-center relative">
            <div>
              <p className="text-[16px] font-semibold">Offer a New Token</p>{" "}
              <p className="text-[14px] text-gray100">
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
        {userDistributions &&
          userDistributions.map((distribution, index: number) => (
            <DistributionCard key={index} distribution={distribution} />
          ))}
      </div>
    </>
  );
};

export default TokenTapContent;
