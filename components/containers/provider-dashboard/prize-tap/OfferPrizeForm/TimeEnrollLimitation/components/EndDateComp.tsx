"use client";

import { useEffect, useRef, useState } from "react";
import DatePicker from "react-multi-date-picker";
import TimePicker from "react-multi-date-picker/plugins/time_picker";
import "react-multi-date-picker/styles/layouts/mobile.css";
import styled from "styled-components";
import { ErrorProps } from "@/types";
import { usePrizeOfferFormContext } from "@/context/providerDashboardContext";

interface EndDateCompProp {
  showErrors: ErrorProps | null;
}

const EndDateComp = ({ showErrors }: EndDateCompProp) => {
  const { data, handleSetDate, isShowingDetails, handleSetEnrollDuration } =
    usePrizeOfferFormContext();
  const [endDate, setEndDate] = useState<any>();

  useEffect(() => {
    if (data.endTimeStamp) {
      setEndDate(data.endTimeStamp * 1000);
    }
  }, []);

  useEffect(() => {
    if (data.startTimeStamp) {
      setEndDate(data.endTimeStamp * 1000);
    }
  }, [data.startTimeStamp, data.endTimeStamp]);

  const changeTime = (e: any) => {
    if (e?.unix) {
      handleSetDate(
        Math.round(new Date(e.unix * 1000).setSeconds(0) / 1000),
        "endTime"
      );
    }
    setEndDate(e);
  };

  const timePriceClick = (openCalendar: any) => {
    if (isShowingDetails) return;
    openCalendar();
    handleSetEnrollDuration(-1);
  };

  return (
    <div className="relative w-full">
      <div
        className={`flex  ${
          showErrors && showErrors.endDateStatusMessage
            ? "border-error"
            : "border-gray50"
        } `}
      >
        <DatePicker
          disabled={!data.startTimeStamp || isShowingDetails}
          style={{
            border: "none",
            width: "100%",
            background: "none",
            color: "#b5b5c6",
            display: "none",
          }}
          containerStyle={{
            width: "100%",
          }}
          name="endTime"
          format="DD/MM/YYYY - hh:mm A"
          plugins={[<TimePicker key={0} position="bottom" hideSeconds />]}
          render={(value, openCalendar) => {
            return (
              <p
                className="select-not"
                onClick={() => timePriceClick(openCalendar)}
              >
                or Select Date & Time Manually
              </p>
            );
          }}
          onChange={changeTime}
          value={endDate}
          minDate={Date.now()}
          className="rmdp-mobile animate-fadeIn"
        />
      </div>
      {showErrors && showErrors.endDateStatus == false && (
        <p className="text-error text-[10px] m-0 p-0 mt-[2px] absolute left-1">
          {showErrors && showErrors.endDateStatusMessage}
        </p>
      )}
    </div>
  );
};

export default EndDateComp;
