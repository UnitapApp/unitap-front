"use client";

import styled from "styled-components";
import { ProviderDashboardFormDataProp } from "@/types";
import { DV } from "@/components/ui/designVariables";
import { useTokenTapFromContext } from "@/context/providerDashboardTokenTapContext";
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
  const { requirementList } = useTokenTapFromContext();
  const prizeName = data.isNft
    ? data.nftName
    : data.isNativeToken
    ? data.selectedChain.symbol
    : data.tokenSymbol;

  return (
    <div
      className={`bg-gray40  rounded-xl min-w-[348px] select-not flex-row gap-4 mt-5 overflow-hidden styled-scroll `}
    >
      <div className="flex gap-3 m-3">
        <div>
          <Icon
            iconSrc={data.selectedChain.logoUrl}
            width="35px"
            height="35px"
          />
        </div>

        <div>
          <div className="flex flex-col">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <p className="text-xs">{prizeName}</p>
                <Icon
                  iconSrc="/assets/images/provider-dashboard/ic_link_gray.svg"
                  className="cursor-pointer"
                />
              </div>
              <p className="text-2xs">Decentralized verification system</p>
            </div>
          </div>
          <div className="text-gray100 text-2xs mt-3">{data.description}</div>
          <div className="flex gap-2  mt-3">
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
        </div>
      </div>

      <div className="h-[32px] flex items-center pl-4 justify-between bg-gray30">
        <div className="text-xs text-gray100 flex items-center gap-2">
          Claim on {data.selectedChain.chainName}
          <Icon
            iconSrc={data.selectedChain.logoUrl}
            width="12px"
            height="12px"
          />
        </div>
        <div className="flex text-gray90 text-2xs bg-gray20 h-full items-center gap-2 px-2">
          Repeats Weekly
          <div className="opacity-50">
            <Icon
              iconSrc="/assets/images/provider-dashboard/warn-loading.svg"
              height="10px"
              width="10px"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormYouFilled;
