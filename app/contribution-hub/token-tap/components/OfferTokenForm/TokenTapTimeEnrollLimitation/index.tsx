import { useEffect, useState } from "react";
import { ErrorProps, ProviderFormPaginationProp } from "@/types";
import StartDateComp from "./components/StartDateComp";
import ManualDuration from "./components/ManualDuration";
import PeopleLimitation from "./components/PeopleLimitation";
import Pagination from "@/app/contribution-hub/pagination";
import { useTokenTapFromContext } from "@/context/providerDashboardTokenTapContext";
import Icon from "@/components/ui/Icon";

export const TimeEnrollLimitationDescription = {
  id: 1,
  prevIcon: "/assets/images/provider-dashboard/step-1-green.svg",
  activeIcon: "/assets/images/provider-dashboard/step-1-active.svg",
  nextIcon: "/assets/images/provider-dashboard/step-1-off.svg",
  title: "Time/Enrollment Limitation",
  description: "Information of time and enrollment ",
};

const TokenTapTimeEnrollLimitation = ({
  handleChangeFormPagePrev,
  handleChangeFormPageNext,
}: ProviderFormPaginationProp) => {
  const {
    page,
    canGoStepThree,
    isShowingDetails,
    handleSetClaimPeriodic,
    claimPeriodic,
  } = useTokenTapFromContext();
  const [showErrors, setShowErrors] = useState<ErrorProps | null>(null);
  const [fadeClass, setFadeClass] = useState("");

  useEffect(() => {
    setFadeClass(page == 1 ? "animate-fadeIn" : "animate-fadeOut");
  }, [page]);

  const handleNextPage = () => {
    if (isShowingDetails) {
      setShowErrors(null);
      handleChangeFormPageNext();
      return;
    }
    const res: any = canGoStepThree();
    if (
      res.endDateStatus &&
      res.startDateStatus &&
      res.numberOfDurationStatus &&
      res.maximumLimitationStatus &&
      res.numberOfWinnersStatus
    ) {
      setShowErrors(null);
      handleChangeFormPageNext();
    } else {
      setShowErrors(res);
    }
  };

  return (
    <div
      className={`flex flex-col items-center justify-center w-full animate-fadeIn ${fadeClass}`}
    >
      <div
        className={`flex flex-col min-h-[340px] gap-5 w-full items-center max-w-[452px] mb-[84px]`}
      >
        <div className="flex items-center justify-between w-full text-center">
          <div
            onClick={() => {
              if (isShowingDetails) return;
              handleSetClaimPeriodic(false);
            }}
            className={`${claimPeriodic ? "bg-gray30" : "bg-gray40"
              } flex flex-col rounded-[12px_0px_0px_12px] cursor-pointer border border-gray50 w-full h-[43px] items-center justify-center`}
          >
            <p
              className={`${!claimPeriodic ? "text-white" : "text-gray90"
                } text-xs`}
            >
              Single Claim Tap
            </p>
            <p
              className={`${!claimPeriodic ? "text-gray100" : "text-gray90"
                } text-2xs`}
            >
              ( Users can only claim once)
            </p>
          </div>
          <div
            onClick={() => {
              if (isShowingDetails) return;
              handleSetClaimPeriodic(true);
            }}
            className={`${!claimPeriodic ? "bg-gray30" : "bg-gray40"
              } flex flex-col rounded-[0px_12px_12px_0px] cursor-pointer  border border-gray50 w-full h-[43px] items-center justify-center`}
          >
            <p
              className={`${claimPeriodic ? "text-white" : "text-gray90"
                } text-xs`}
            >
              Periodic Tap
            </p>
            <p
              className={`${claimPeriodic ? "text-gray100" : "text-gray90"
                } text-2xs`}
            >
              (Users can claim once per round.)
            </p>
          </div>
        </div>
        <StartDateComp showErrors={showErrors} />
        <ManualDuration showErrors={showErrors} />

        <div className="text-xs text-gray100 flex items-center justify-center text-center w-full max-w-[452px] absolute top-[35em] px-2">

          <div className="flex">
            <Icon
              className="mt-[-1px]"
              width="18px"
              height="18px"
              iconSrc="/assets/images/provider-dashboard/exclamationMark.svg"
            />
            <p>
              Validating requests usually takes around 1 week. if you need for your raffle to go live sooner, please contact us at
              <a
                target="_blank"
                href="mailto: help@unitap.app"
                className="text-white"
              >
                {" "}help@unitap.app

              </a>
            </p>
          </div>
        </div>
      </div>
      <Pagination
        handleChangeFormPagePrev={handleChangeFormPagePrev}
        handleNextPage={handleNextPage}
        page={page}
      />
    </div>
  );
};

export default TokenTapTimeEnrollLimitation;
