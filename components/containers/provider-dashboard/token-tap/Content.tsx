"use client";

import {
  ProviderDashboardButton,
  ProviderDashboardButtonCheck,
  ProviderDashboardButtonRejected,
  ProviderDashboardButtonSuccess,
} from "../Buttons";
import Icon from "@/components/ui/Icon";
import SearchInput from "../prize-tap/SearchInput";
import { ProviderDashboardCardTimer } from "../prize-tap/CardTimer";
import Styles from "./content.module.scss";

const handleSetSearchPhrase = () => {};

const TokenTapContent = () => {
  const startTime = "20 Januray 2023 12:00 PM UTC";
  const FinishTime = "30 March 2023 12:00 PM UTC";
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
          <div className="flex mt-5 sm:mt-0 items-center justify-center cursor-pointer border-2 border-white rounded-[12px] bg-[#0C0C17] w-[226px] h-[46px]">
            + Provide a New Token
          </div>
        </div>
      </div>
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        <div className="bg-gray30 border-2 border-gray40 w-full p-4 rounded-xl relative h-[264px]">
          <div className="provideToken-item-container">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <Icon
                  iconSrc="/assets/images/provider-dashboard/btc_lightning_logo 1.svg"
                  width="36px"
                  height="36px"
                />
                <p className="text-[14px] font-medium text-white">BTC</p>
              </div>
              <div>
                <ProviderDashboardButton className="animate-blinking">
                  <p>Ongoing...</p>
                </ProviderDashboardButton>
              </div>
            </div>
            <div className="text-[10px] font-medium mt-2 text-white">
              Decentralized verification system
            </div>
            <div className="flex justify-between my-3">
              <div className="flex items-center gap-3">
                <div className="text-gray100 text-[10px]">
                  on Bitcoin Lightning
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
              <p className="text-white font-medium text-[8px] mb-2">Ends in:</p>
              <ProviderDashboardCardTimer
                startTime={startTime}
                FinishTime={FinishTime}
              />
            </div>
          </div>
        </div>

        <div className="bg-gray30 border-2 border-gray40 w-full p-4 rounded-xl relative h-[264px]">
          <div className="provideToken-item-container">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <Icon
                  iconSrc="/assets/images/provider-dashboard/btc_lightning_logo 1.svg"
                  width="36px"
                  height="36px"
                />
                <p className="text-[14px] font-medium text-white">BTC</p>
              </div>
              <div>
                <ProviderDashboardButtonSuccess>
                  Verified
                </ProviderDashboardButtonSuccess>
              </div>
            </div>
            <div className="text-[10px] font-medium mt-2 text-white">
              Decentralized verification system
            </div>
            <div className="flex justify-between my-3">
              <div className="flex items-center gap-3">
                <div className="text-gray100 text-[10px]">
                  on Bitcoin Lightning
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
            <div className="provideToken_timer absolute bottom-2 right-4 left-4">
              <p className="text-white font-medium text-[8px] mb-2">
                starts in:
              </p>
              <ProviderDashboardCardTimer
                startTime={startTime}
                FinishTime={FinishTime}
              />
            </div>
          </div>
        </div>

        <div className="bg-gray30 border-2 border-gray40 w-full p-4 rounded-xl relative h-[264px]">
          <div className="provideToken-item-container">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <Icon
                  iconSrc="/assets/images/provider-dashboard/btc_lightning_logo 1.svg"
                  width="36px"
                  height="36px"
                />
                <p className="text-[14px] font-medium text-white">BTC</p>
              </div>
              <div>
                <ProviderDashboardButtonRejected>
                  Rejected
                </ProviderDashboardButtonRejected>
              </div>
            </div>
            <div className="text-[10px] font-medium mt-2 text-white">
              Decentralized verification system
            </div>
            <div className="flex justify-between my-3">
              <div className="flex items-center gap-3">
                <div className="text-gray100 text-[10px]">
                  on Bitcoin Lightning
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
            <div className="provideToken_timer absolute bottom-2 right-4 left-4">
              <ProviderDashboardButtonCheck>
                Check For Reasons
              </ProviderDashboardButtonCheck>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TokenTapContent;
