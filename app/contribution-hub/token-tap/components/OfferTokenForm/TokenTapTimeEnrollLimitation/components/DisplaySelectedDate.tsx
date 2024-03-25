import { useTokenTapFromContext } from "@/context/providerDashboardTokenTapContext";
import React from "react";

const DisplaySelectedDate = () => {
  const { data } = useTokenTapFromContext();
  return (
    <div>
      {data.endTimeStamp && (
        <div
          className={`w-full ${
            data.startTimeStamp >= data.endTimeStamp ||
            data.endTimeStamp - data.startTimeStamp < 60 * 60
              ? "text-error"
              : "text-gray100"
          }`}
        >
          End Time:{" "}
          {(Number(new Date(data.endTimeStamp * 1000).getDate()) < 10
            ? "0" + new Date(data.endTimeStamp * 1000).getDate()
            : new Date(data.endTimeStamp * 1000).getDate()) +
            "/" +
            (Number(new Date(data.endTimeStamp * 1000).getMonth()) + 1 < 10
              ? "0" +
                (Number(new Date(data.endTimeStamp * 1000).getMonth()) + 1)
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
      )}
    </div>
  );
};

export default DisplaySelectedDate;
