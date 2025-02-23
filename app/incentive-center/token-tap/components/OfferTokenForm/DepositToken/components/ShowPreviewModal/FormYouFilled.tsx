"use client";

import { ProviderDashboardFormDataProp } from "@/types";
import { useTokenTapFromContext } from "@/context/providerDashboardTokenTapContext";
import Icon from "@/components/ui/Icon";

interface Prop {
  data: ProviderDashboardFormDataProp;
}
const FormYouFilled = ({ data }: Prop) => {
  const { requirementList, claimPeriodic } = useTokenTapFromContext();
  const prizeName = data.isNft
    ? data.nftName
    : data.isNativeToken
      ? data.selectedChain.symbol
      : data.tokenSymbol;

  return (
    <div
      className={`styled-scroll mt-5 min-w-[348px] select-none flex-row gap-4 overflow-hidden rounded-xl bg-gray40`}
    >
      <div className="m-3 flex gap-3">
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
                  iconSrc="/quest/assets/images/provider-dashboard/ic_link_gray.svg"
                  className="cursor-pointer"
                />
              </div>
              <p className="text-2xs">{data.provider}</p>
            </div>
          </div>
          <div className="mt-3 text-2xs text-gray100">{data.description}</div>
          <div className="mt-3 flex gap-2">
            {requirementList.length > 0
              ? requirementList.map((item, index) => {
                  return (
                    <div
                      className="rounded border border-gray70 bg-gray50 p-1 px-2 text-2xs text-gray100"
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

      <div className="flex h-[32px] items-center justify-between bg-gray30 pl-4">
        <div className="flex items-center gap-2 text-xs text-gray100">
          Claim on {data.selectedChain.chainName}
          <Icon
            iconSrc={data.selectedChain.logoUrl}
            width="12px"
            height="12px"
          />
        </div>
        <div className="flex h-full items-center gap-2 bg-gray20 px-2 text-2xs text-gray90">
          {claimPeriodic ? "Periodic-Claim" : "Single-Claim"}
          <div className="opacity-50">
            <Icon
              iconSrc="/quest/assets/images/provider-dashboard/warn-loading.svg"
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
