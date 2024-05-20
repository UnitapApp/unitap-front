// import { usePrizeOfferFormContext } from "@/context/providerDashboardContext";
import React from "react";

const DisplaySelectedDate = ({ selectedDate }: any) => {
  return (
    <div className="w-fll">
      {selectedDate && (
        <div className="w-full text-gray100">
          End Time:{" "}
          {(Number(new Date(selectedDate * 1000).getDate()) < 10
            ? "0" + new Date(selectedDate * 1000).getDate()
            : new Date(selectedDate * 1000).getDate()) +
            "/" +
            (Number(new Date(selectedDate * 1000).getMonth()) + 1 < 10
              ? "0" +
              (Number(new Date(selectedDate * 1000).getMonth()) + 1)
              : Number(new Date(selectedDate * 1000).getMonth()) + 1) +
            "/" +
            new Date(selectedDate * 1000).getFullYear() +
            " - " +
            (Number(new Date(selectedDate * 1000).getHours()) < 10
              ? "0" + Number(new Date(selectedDate * 1000).getHours())
              : Number(new Date(selectedDate * 1000).getHours())) +
            ":" +
            (Number(new Date(selectedDate * 1000).getMinutes()) < 10
              ? "0" + Number(new Date(selectedDate * 1000).getMinutes())
              : Number(new Date(selectedDate * 1000).getMinutes()))}
        </div>
      )}
    </div>
  );
};

export default DisplaySelectedDate;
