"use client";

import styled from "styled-components";
import { ProviderDashboardFormDataProp } from "@/types";
import { DV } from "@/components/ui/designVariables";
import { usePrizeOfferFormContext } from "@/context/providerDashboardContext";
import Icon from "@/components/ui/Icon";
import { ProviderDashboardButtonSubmit } from "@/app/contribution-hub/Buttons";
import RaffleCardTimerSubmitContribution from "./RaffleCardTimerSubmitContribution";

const Action = styled.div`
	display: flex;

	// @media only screen and (max-width: ${DV.breakpoints.smallDesktop}) {
		flex-direction: column;
	}
`;

interface Prop {
  data: ProviderDashboardFormDataProp;
}
const FormYouFilled = ({ data }: Prop) => {
  const { requirementList } = usePrizeOfferFormContext();
  const prizeName = data.isNft
    ? data.nftName
    : data.isNativeToken
    ? data.tokenAmount + " " + data.selectedChain.symbol
    : data.tokenAmount + " " + data.tokenSymbol;

  const winnersCount = data.isNft ? data.nftTokenIds.length : data.winnersCount;

  return (
    <div
      className={`flex ${
        data.isNft ? "prize-card-bg-1" : "prize-card-bg-2"
      } min-w-[348px] select-not flex-row gap-4 mt-5 overflow-hidden overflow-x-scroll cursor-pointer styled-scroll pb-8`}
    >
      <div className="bg-gray30 border border-gray40 rounded-md min-w-[208px] min-h-[208px] max-h-[208px] relative flex justify-center">
        <div
          className="providePrize__amount_modal flex flex-col justify-center items-center"
          data-amount={prizeName}
        >
          <Icon
            iconSrc={data.selectedChain.logoUrl}
            width="25px"
            height="25px"
            className="mb-2"
          />
          <p className="mb-8">{prizeName}</p>
        </div>
        <div className="flex items-center bg-gray50 justify-center gap-2 absolute bottom-[-12px] left-7 border border-gray70 rounded-[3px] p-1 min-w-[150px] min-h-[25px]">
          <p className="text-gray100 text-2xs font-semibold">
            on{" "}
            {data.selectedChain?.chainName ? data.selectedChain.chainName : ""}
          </p>
          <Icon
            iconSrc={data.selectedChain ? data.selectedChain.logoUrl : ""}
            width="16px"
            height="16px"
          />
        </div>
      </div>
      <div className="bg-gray30 border border-gray40 rounded-md min-h-[100px] max-h-[208px] text-sm text-white p-4">
        <div className="flex justify-between">
          <div className="flex items-center">
            <p>{prizeName}</p>
            {winnersCount > 1 && (
              <p className="rounded-xl ml-5 font-semibold text-xs p-1 px-2 bg-gray10 text-gray100">
                {winnersCount + "x winners"}
              </p>
            )}
          </div>
          <div className="flex gap-2">
            {data.twitter ? (
              <Icon
                onClick={() =>
                  window.open(
                    "https://twitter.com/" + data.twitter!.replace("@", ""),
                    "_blank"
                  )
                }
                iconSrc="/assets/images/provider-dashboard/twitter.svg"
              />
            ) : null}
            {data.discord ? (
              <Icon
                onClick={() => window.open(data.discord!, "_blank")}
                iconSrc="/assets/images/provider-dashboard/discord.svg"
              />
            ) : null}
            {data.creatorUrl ? (
              <Icon
                onClick={() =>
                  window.open("https://" + data.creatorUrl!, "_blank")
                }
                iconSrc="/assets/images/provider-dashboard/creatorUrl.svg"
              />
            ) : null}
          </div>
        </div>
        <div className="text-gray80 text-base mt-1 mb-2">
          by {data.provider}
        </div>
        <div className="text-sm text-gray100 text-xs leading-5 mb-6 grow shrink-0 basis-auto text-justify">
          {data.description}
        </div>
        <div className="flex gap-2 mb-2 ">
          {requirementList.length > 0
            ? requirementList.map((item, index) => {
                return (
                  <div
                    className="text-gray100 border border-gray70 bg-gray50 p-1 px-2 text-2xs rounded"
                    key={index}
                  >
                    {item.isNotSatisfy && "Not "} {item.title}
                  </div>
                );
              })
            : null}
        </div>
        <Action
          className={`w-full sm:w-auto items-center sm:items-end  ${
            requirementList.length == 0 ? "mt-10" : ""
          }`}
        >
          <span className="flex flex-row items-center justify-between w-full gap-4 ">
            <div className="flex flex-row gap-4 justify-between w-full  items-center bg-gray40 px-5 h-full py-1 rounded-xl">
              <p className="text-xs text-gray100">0 people enrolled</p>
              <RaffleCardTimerSubmitContribution
                startTime={new Date(data.startTimeStamp * 1000).toString()}
                FinishTime={new Date(data.endTimeStamp * 1000).toString()}
              />
            </div>
            <div className="w-[200px]">
              <ProviderDashboardButtonSubmit $fontSize="12px" height="38px">
                <p>Enroll</p>
                <div className="absolute right-3">
                  <Icon
                    width="20px"
                    height="20px"
                    iconSrc="/assets/images/prize-tap/header-prize-logo.svg"
                  />
                </div>
              </ProviderDashboardButtonSubmit>
            </div>
          </span>
        </Action>
      </div>
    </div>
  );
};

export default FormYouFilled;
