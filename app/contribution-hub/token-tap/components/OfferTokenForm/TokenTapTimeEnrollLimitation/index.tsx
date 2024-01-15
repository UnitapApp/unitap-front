import { useEffect, useState } from "react";
import { ErrorProps, ProviderFormPaginationProp } from "@/types";
import StartDateComp from "./components/StartDateComp";
import ManualDuration from "./components/ManualDuration";
import PeopleLimitation from "./components/PeopleLimitation";
import Pagination from "@/app/contribution-hub/pagination";
import { useTokenTapFromContext } from "@/context/providerDashboardTokenTapContext";

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
            // onClick={() => handleSetClaimPeriodic(false)}
            className={`${
              claimPeriodic ? "bg-gray30" : "bg-gray40"
            } flex flex-col rounded-[12px_0px_0px_12px] cursor-pointer border border-gray50 w-full h-[43px] items-center justify-center`}
          >
            <p
              className={`${
                !claimPeriodic ? "text-white" : "text-gray90"
              } text-xs`}
            >
              OneTime-Claimable
            </p>
            <p
              className={`${
                !claimPeriodic ? "text-gray100" : "text-gray90"
              } text-[10px]`}
            >
              (Each person can claim once.)
            </p>
          </div>
          <div
            // onClick={() => handleSetClaimPeriodic(true)}
            className={`${
              !claimPeriodic ? "bg-gray30" : "bg-gray40"
            } flex flex-col rounded-[0px_12px_12px_0px] cursor-pointer  border border-gray50 w-full h-[43px] items-center justify-center`}
          >
            <p
              className={`${
                claimPeriodic ? "text-white" : "text-gray90"
              } text-xs`}
            >
              Periodic-Claimable
            </p>
            <p
              className={`${
                claimPeriodic ? "text-gray100" : "text-gray90"
              } text-[10px]`}
            >
              (Each person can claim once in a month.)
            </p>
          </div>
        </div>
        <StartDateComp showErrors={showErrors} />
        <ManualDuration showErrors={showErrors} />
        <PeopleLimitation showErrors={showErrors} />
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
