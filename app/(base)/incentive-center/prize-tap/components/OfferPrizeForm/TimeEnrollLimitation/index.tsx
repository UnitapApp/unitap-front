import { useEffect, useState } from "react";
import { ErrorProps, ProviderFormPaginationProp } from "@/types";
import StartDateComp from "./components/StartDateComp";
import ManualDuration from "./components/ManualDuration";
import PeopleLimitation from "./components/PeopleLimitation";
import Pagination from "@/app/(base)/incentive-center/components/pagination";
import { usePrizeOfferFormContext } from "@/context/providerDashboardContext";
import Icon from "@/components/ui/Icon";

export const TimeEnrollLimitationDescription = {
  id: 1,
  prevIcon: "/assets/images/provider-dashboard/step-1-green.svg",
  activeIcon: "/assets/images/provider-dashboard/step-1-active.svg",
  nextIcon: "/assets/images/provider-dashboard/step-1-off.svg",
  title: "Time/Enrollment Limitation",
  description: "Information of time and enrollment ",
};

const TimeEnrollLimitation = ({
  handleChangeFormPagePrev,
  handleChangeFormPageNext,
}: ProviderFormPaginationProp) => {
  const { page, canGoStepThree, isShowingDetails } = usePrizeOfferFormContext();
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
      className={`flex w-full animate-fadeIn flex-col items-center justify-center ${fadeClass}`}
    >
      <div
        className={`mb-[84px] flex min-h-[340px] w-full max-w-[452px] flex-col items-center gap-5`}
      >
        <StartDateComp showErrors={showErrors} />
        <ManualDuration showErrors={showErrors} />
        <PeopleLimitation showErrors={showErrors} />
        {/* <div className="absolute top-[35em] flex w-full max-w-[452px] items-center justify-center px-2 text-center text-xs text-gray100">
          <div className="flex">
            <Icon
              className="mt-[-1px]"
              width="18px"
              height="18px"
              iconSrc="/assets/images/provider-dashboard/exclamationMark.svg"
            />
            <p>
              Validating requests usually takes around 1 week. if you need for
              your raffle to go live sooner, please contact us at
              <a
                target="_blank"
                href="mailto: support@unitap.app"
                className="text-white"
              >
                {" "}
                help@unitap.app
              </a>
            </p>
          </div>
        </div> */}
      </div>
      <Pagination
        handleChangeFormPagePrev={handleChangeFormPagePrev}
        handleNextPage={handleNextPage}
        page={page}
      />
    </div>
  );
};

export default TimeEnrollLimitation;
