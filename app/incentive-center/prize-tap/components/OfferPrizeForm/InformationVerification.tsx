"use client";

import Icon from "@/components/ui/Icon";
import { usePrizeOfferFormContext } from "@/context/providerDashboardContext";
import { ProviderDashboardGoToDashBoard } from "@/app/incentive-center/components/Buttons";
import Link from "next/link";
import RoutePath from "@/utils/routes";

const InformationVerification = () => {
  const { selectedRaffleForCheckReason } = usePrizeOfferFormContext();
  return (
    <div className="flex w-full max-w-[452px] animate-fadeIn flex-col gap-5 text-center text-xs font-medium text-gray100">
      <div className="flex min-h-[292px] flex-col gap-5">
        <Icon iconSrc="/quest/assets/images/provider-dashboard/diamond.png" />
        <div className="flex items-center justify-center gap-2 text-sm font-semibold text-white">
          {!selectedRaffleForCheckReason ? (
            <div className="flex items-center gap-2">
              {" "}
              <p>Validating</p>{" "}
              <Icon
                className="ml-[-3px]"
                iconSrc="/quest/assets/images/provider-dashboard/loading.svg"
                width="20px"
                height="4px"
              />{" "}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <p className="text-error">Rejected</p>{" "}
              <Icon
                className="ml-[-3px]"
                iconSrc="/quest/assets/images/provider-dashboard/close-circle.svg"
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
          <div className="relative rounded-xl bg-gray50 p-4 leading-5">
            <div className="flex flex-col items-center justify-center md:flex-row">
              <Icon
                className="ml-[-5px] mr-[5px]"
                width="12px"
                height="12px"
                iconSrc="/quest/assets/images/provider-dashboard/exclamationMark.svg"
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
                href="mailto:Support@unitap.app"
                className="flex items-center justify-center gap-1 text-white"
              >
                Support@unitap.app
                <Icon iconSrc="/quest/assets/images/provider-dashboard/ic_link_gray.svg" />
              </a>
            </div>
          </div>
        ) : (
          <div>
            <div className="relative rounded-xl bg-gray50 p-4 leading-5">
              <div className="flex flex-col items-center justify-center md:flex-row">
                <Icon
                  className="ml-[-5px] mr-[5px]"
                  width="12px"
                  height="12px"
                  iconSrc="/quest/assets/images/provider-dashboard/rejected.svg"
                />
                <p>{selectedRaffleForCheckReason.rejectionReason}</p>
              </div>
            </div>
            <div className="mt-10">
              <p>
                Send your request again and we will check it again or contact us
                via this email address:
              </p>
              <div className="flex items-center justify-center gap-1">
                <a
                  href="mailto:Support@unitap.app"
                  target="_black"
                  className="flex gap-1 text-white"
                >
                  Support@unitap.app
                  <Icon iconSrc="/quest/assets/images/provider-dashboard/ic_link_gray.svg" />
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
      <Link
        // onClick={handleGOToDashboard}
        href={RoutePath.PROVIDER_PRIZETAP}
        className="mt-[111px] flex w-full max-w-[452px] flex-col items-center lg:flex-row"
      >
        <ProviderDashboardGoToDashBoard>
          Go To Dashboard
        </ProviderDashboardGoToDashBoard>
      </Link>
    </div>
  );
};

export default InformationVerification;
