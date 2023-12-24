import { usePrizeOfferFormContext } from "@/context/providerDashboardContext";
import React from "react";

const DisplaySelectedDate = () => {
  const { data } = usePrizeOfferFormContext();
  return (
    <div
      className={`${
        data.startTimeStamp >= data.endTimeStamp ? "text-error" : "text-gray100"
      }`}
    >
      Raffle Time:{" "}
      {(Number(new Date(data.endTimeStamp * 1000).getDate()) < 10
        ? "0" + new Date(data.endTimeStamp * 1000).getDate()
        : new Date(data.endTimeStamp * 1000).getDate()) +
        "/" +
        (Number(new Date(data.endTimeStamp * 1000).getMonth()) + 1 < 10
          ? "0" + (Number(new Date(data.endTimeStamp * 1000).getMonth()) + 1)
          : Number(new Date(data.endTimeStamp * 1000).getMonth()) + 1) +
        "/" +
        new Date(data.endTimeStamp * 1000).getFullYear() +
        " - " +
        (Number(new Date(data.endTimeStamp * 1000).getHours()) < 10
          ? "0" + Number(new Date(data.endTimeStamp * 1000).getHours())
          : Number(new Date(data.endTimeStamp * 1000).getHours())) +
        ":" +
        (Number(new Date(data.endTimeStamp * 1000).getMinutes()) < 10
          ? "0" + Number(new Date(data.endTimeStamp * 1000).getMinutes())
          : Number(new Date(data.endTimeStamp * 1000).getMinutes()))}
    </div>
  );
};

export default DisplaySelectedDate;
