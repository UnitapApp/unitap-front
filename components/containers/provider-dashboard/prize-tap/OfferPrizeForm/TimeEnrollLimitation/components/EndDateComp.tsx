"use client";

import { useEffect, useState } from "react";
import DatePicker from "react-multi-date-picker";
import TimePicker from "react-multi-date-picker/plugins/time_picker";
import "react-multi-date-picker/styles/layouts/mobile.css";
import styled from "styled-components";
import { ErrorProps } from "@/types";
import { usePrizeOfferFormContext } from "@/context/providerDashboardContext";
const Input = styled.input``;
interface EndDateCompProp {
  showErrors: ErrorProps | null;
}

const EndDateComp = ({ showErrors }: EndDateCompProp) => {
  const { data, handleSetDate, setDuration, isShowingDetails } =
    usePrizeOfferFormContext();

  const [endDate, setEndDate] = useState<any>();

  useEffect(() => {
    if (data.endTimeStamp && !setDuration) {
      setEndDate(data.endTimeStamp * 1000);
    }
  }, []);

  const changeTime = (e: any) => {
    if (e?.unix) {
      handleSetDate(
        Math.round(new Date(e.unix * 1000).setSeconds(0) / 1000),
        "endTime"
      );
    }
    setEndDate(e);
  };

  const handleChange = () => {};
  return (
    <div className="relative w-full">
      <div
        className={`flex gap-1 text-gray80 text-[12px] bg-gray40 border ${
          showErrors && showErrors.endDateStatusMessage
            ? "border-error"
            : "border-gray50"
        } rounded-xl h-[43px] items-center justify-between w-full max-w-[452px] overflow-hidden`}
      >
        <p className="text-gray100 text-[12px] w-full max-w-[148px] bg-gray30 h-full flex items-center justify-center">
          End Date & Time
        </p>
        <DatePicker
          disabled={!data.startTimeStamp || isShowingDetails}
          style={{
            border: "none",
            width: "100%",
            background: "none",
            color: "#b5b5c6",
            display: "flex",
          }}
          containerStyle={{
            width: "100%",
          }}
          name="startTime"
          format="DD/MM/YYYY - hh:mm A"
          inputClass="custom-input"
          plugins={[<TimePicker position="bottom" hideSeconds key={0} />]}
          render={
            <Input
              className="date-picker-input"
              onChange={handleChange}
              readOnly
              placeholder="DD/MM/YYYY - HH:MM"
            />
          }
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
