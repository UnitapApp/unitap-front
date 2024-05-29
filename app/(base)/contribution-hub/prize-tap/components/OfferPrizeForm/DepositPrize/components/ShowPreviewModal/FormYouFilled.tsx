"use client"

import styled from "styled-components"
import { ProviderDashboardFormDataProp } from "@/types"
import { DV } from "@/components/ui/designVariables"
import { usePrizeOfferFormContext } from "@/context/providerDashboardContext"
import Icon from "@/components/ui/Icon"
import { ProviderDashboardButtonSubmit } from "@/app/(base)/contribution-hub/components/Buttons"
import RaffleCardTimerSubmitContribution from "./RaffleCardTimerSubmitContribution"

const Action = styled.div`
	display: flex;

	// @media only screen and (max-width: ${DV.breakpoints.smallDesktop}) {
		flex-direction: column;
	}
`

interface Prop {
  data: ProviderDashboardFormDataProp
}
const FormYouFilled = ({ data }: Prop) => {
  const { requirementList } = usePrizeOfferFormContext()
  const prizeName = data.isNft
    ? data.nftName
    : data.isNativeToken
      ? data.tokenAmount + " " + data.selectedChain.symbol
      : data.tokenAmount + " " + data.tokenSymbol

  const winnersCount = data.isNft ? data.nftTokenIds.length : data.winnersCount

  return (
    <div
      className={`flex ${
        data.isNft ? "prize-card-bg-1" : "prize-card-bg-2"
      } styled-scroll mt-5 min-w-[348px] cursor-pointer select-none flex-row gap-4 overflow-hidden overflow-x-scroll pb-8`}
    >
      <div className="relative flex max-h-[208px] min-h-[208px] min-w-[208px] justify-center rounded-md border border-gray40 bg-gray30">
        <div
          className="providePrize__amount_modal flex flex-col items-center justify-center"
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
        <div className="absolute bottom-[-12px] left-7 flex min-h-[25px] min-w-[150px] items-center justify-center gap-2 rounded-[3px] border border-gray70 bg-gray50 p-1">
          <p className="text-2xs font-semibold text-gray100">
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
      <div className="max-h-[208px] min-h-[100px] rounded-md border border-gray40 bg-gray30 p-4 text-sm text-white">
        <div className="flex justify-between">
          <div className="flex items-center">
            <p>{prizeName}</p>
            {winnersCount > 1 && (
              <p className="ml-5 rounded-xl bg-gray10 p-1 px-2 text-xs font-semibold text-gray100">
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
                    "_blank",
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
                  window.open(
                    data.creatorUrl!.includes("https://")
                      ? data.creatorUrl!
                      : data.creatorUrl!.includes("www.")
                        ? "https://" + data.creatorUrl!.replace("www.", "")!
                        : "https://" + data.creatorUrl!,
                    "_blank",
                  )
                }
                iconSrc="/assets/images/provider-dashboard/creatorUrl.svg"
              />
            ) : null}
          </div>
        </div>
        <div className="mb-2 mt-1 text-base text-gray80">
          by {data.provider}
        </div>
        <div className="h-[40px] max-h-[40px] text-justify text-sm">
          {data.description}
        </div>
        <div className="mb-2 flex gap-2 ">
          {requirementList.length > 0
            ? requirementList.map((item, index) => {
                return (
                  <div
                    className="rounded border border-gray70 bg-gray50 p-1 px-2 text-2xs text-gray100"
                    key={index}
                  >
                    {item.isNotSatisfy && "Not "} {item.title}
                  </div>
                )
              })
            : null}
        </div>
        <Action
          className={`w-full items-center sm:w-auto sm:items-end  ${
            requirementList.length == 0 ? "mt-10" : ""
          }`}
        >
          <span className="flex w-full flex-row items-center justify-between gap-4 ">
            <div className="flex h-full w-full flex-row items-center  justify-between gap-4 rounded-xl bg-gray40 px-5 py-1">
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
  )
}

export default FormYouFilled
