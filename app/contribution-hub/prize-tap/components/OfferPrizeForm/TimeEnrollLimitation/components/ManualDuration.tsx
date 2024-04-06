"use client";

import { ErrorProps } from "@/types";
import { usePrizeOfferFormContext } from "@/context/providerDashboardContext";
import DisplaySelectedDate from "./DisplaySelectedDate";
import EndDateComp from "./EndDateComp";

interface ManualDurationProp {
  showErrors: ErrorProps | null;
}

const ManualDuration = ({ showErrors }: ManualDurationProp) => {
  const {
    data,
    enrollmentDurations,
    handleSetEnrollDuration,
    isShowingDetails,
  } = usePrizeOfferFormContext();

  return (
    <div className="w-full text-gray100">
      <p className="mb-2 text-xs">Set Enrollment Duration:</p>
      <div className=" enrollment-duration-wrap flex h-[43px] w-full select-none items-center justify-between overflow-hidden rounded-xl border border-gray50 bg-gray30 text-center text-xs text-gray90">
        {enrollmentDurations.map((item) => (
          <div
            key={item.id}
            onClick={() => {
              if (isShowingDetails || !data.startTimeStamp) return;
              handleSetEnrollDuration(item.id);
            }}
            className={`enrollment-duration flex h-full w-full cursor-pointer items-center justify-center  border-r-2 border-gray50 ${item.selected ? "bg-gray40 text-white" : ""
              } `}
          >
            <div>{item.name}</div>
          </div>
        ))}
      </div>
      <div className="mt-4 grid grid-cols-1 items-center justify-between gap-11 text-sm md:mt-2 md:grid-cols-2">
        <div className="w-full  cursor-pointer text-gray100 underline">
          <EndDateComp showErrors={showErrors} />
        </div>
        <div className="w-full">
          {data.startTimeStamp && <DisplaySelectedDate />}
          {data.startTimeStamp &&
            data.endTimeStamp &&
            (data.startTimeStamp >= data.endTimeStamp ||
              data.endTimeStamp - data.startTimeStamp < 60 * 60) && (
              <p className="absolute m-0 -mt-1 p-0 text-[11px] text-error ">
                The minimum duration is 1 hour.
              </p>
            )}
        </div>
      </div>
    </div>
  );
};

export default ManualDuration;
