"use client";

import Icon from "@/components/ui/Icon";
import { usePrizeOfferFormContext } from "@/context/providerDashboardContext";
import { ProviderDashboardGoToDashBoard } from "@/app/contribution-hub/Buttons";
import Link from "next/link";
import RoutePath from "@/utils/routes";

const InformationVerification = () => {
  const { selectedRaffleForCheckReason } = usePrizeOfferFormContext();
  return (
    <div className="flex flex-col gap-5 w-full max-w-[452px] text-gray100 font-medium text-[12px] text-center animate-fadeIn">
      <div className="flex flex-col gap-5 min-h-[292px]">
        <Icon iconSrc="/assets/images/provider-dashboard/diamond.png" />
        <div className="flex items-center text-sm justify-center text-white font-semibold gap-2">
          {!selectedRaffleForCheckReason ? (
            <div className="flex items-center gap-2">
              {" "}
              <p>Validating</p>{" "}
              <Icon
                className="ml-[-3px]"
                iconSrc="/assets/images/provider-dashboard/loading.svg"
                width="20px"
                height="4px"
              />{" "}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <p className="text-error">Rejected</p>{" "}
              <Icon
                className="ml-[-3px]"
                iconSrc="/assets/images/provider-dashboard/close-circle.svg"
              />{" "}
            </div>
          )}
        </div>
        {!selectedRaffleForCheckReason ? (
          <p>
            Your request has been sent . thank you for your patience while we
            validate your request.
          </p>
        ) : null}
        {!selectedRaffleForCheckReason ? (
          <div className="bg-gray50 p-4 rounded-xl leading-5 relative">
            <div className="flex flex-col md:flex-row items-center justify-center">
              <Icon
                className="ml-[-5px] mr-[5px]"
                width="12px"
                height="12px"
                iconSrc="/assets/images/provider-dashboard/exclamationMark.svg"
              />
              <p>
                It usually takes around 1 week for us to validate your request.
                If you
              </p>
            </div>
            <p>
              haven{"'"}t heard from us by then, we encourage you to contact us
              via this email address:
            </p>
            <div className="flex items-center justify-center gap-1">
              <a
                target="_blank"
                href="mailto:unitap.support@gmail.com"
                className="text-white flex gap-1 items-center justify-center"
              >
                unitap.support@gmail.com
                <Icon iconSrc="/assets/images/provider-dashboard/ic_link_gray.svg" />
              </a>
            </div>
          </div>
        ) : (
          <div>
            <div className="bg-gray50 p-4 rounded-xl leading-5 relative">
              <div className="flex flex-col md:flex-row items-center justify-center">
                <Icon
                  className="ml-[-5px] mr-[5px]"
                  width="12px"
                  height="12px"
                  iconSrc="/assets/images/provider-dashboard/rejected.svg"
                />
                <p>{selectedRaffleForCheckReason.rejectionReason}</p>
              </div>
            </div>
            <div className="mt-10">
              <p>
                Send your request again and we will check it again or contact us
                via this email address:
              </p>
              <div className="flex gap-1 items-center justify-center">
                <a
                  href="mailto:unitap.support@gmail.com"
                  target="_black"
                  className="text-white gap-1 flex"
                >
                  unitap.support@gmail.com
                  <Icon iconSrc="/assets/images/provider-dashboard/ic_link_gray.svg" />
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
      <Link
        // onClick={handleGOToDashboard}
        href={RoutePath.PROVIDER_PRIZETAP}
        className="flex flex-col lg:flex-row w-full max-w-[452px] mt-[111px] items-center"
      >
        <ProviderDashboardGoToDashBoard className="opacity-[.2]">
          Go To Dashboard
        </ProviderDashboardGoToDashBoard>
      </Link>
    </div>
  );
};

export default InformationVerification;
