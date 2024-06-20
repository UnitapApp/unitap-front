"use client";

import { ErrorProps } from "@/types";
import DatePicker, { DateObject } from "react-multi-date-picker";
import TimePicker from "react-multi-date-picker/plugins/time_picker";
import { useEffect, useState } from "react";
import styled from "styled-components";
import { usePrizeOfferFormContext } from "@/context/providerDashboardContext";
import "react-multi-date-picker/styles/layouts/mobile.css";
const Input = styled.input``;

interface StartDateCompProp {
  showErrors: ErrorProps | null;
}

const StartDateComp = ({ showErrors }: StartDateCompProp) => {
  const { data, handleSetDate, isShowingDetails } = usePrizeOfferFormContext();
  const [startDate, setStartDate] = useState<any>();
  const [minDate, setMinDate] = useState<any>();

  useEffect(() => {
    if (data.startTimeStamp) {
      setStartDate(data.startTimeStamp * 1000);
    }

    setMinDate(Date.now() - 10 * 60 * 1000);
  }, []);

  const handleChange = () => {

  };

  const timeChange = (e: any) => {
    if (e?.unix) {
      handleSetDate(
        Math.round(new Date(e.unix * 1000).setSeconds(0) / 1000),
        "startTime"
      );
    }
    setStartDate(e);
  };

  const handleSetAsap = () => {
    const currentTimestamp = Math.floor(Date.now() / 60000) * 60;
    handleSetDate(
      currentTimestamp + 5 * 60,
      "startTime"
    );
    setStartDate(new Date().getTime() + (5 * 60 * 1000))
  }

  return (
    <div className="relative w-full">
      <div
        className={`flex text-xs bg-gray40 border ${showErrors && showErrors.startDateStatus == false
          ? "border-error"
          : "border-gray50"
          } rounded-xl h-[43px] items-center w-full max-w-[452px] overflow-hidden`}
      >
        <p className="text-gray100 text-xs w-full max-w-[148px] bg-gray30 h-full flex items-center justify-center">
          Start Date & Time
        </p>
        <DatePicker
          currentDate={new DateObject({ date: new Date().getTime() + (5 * 60 * 1000) })}
          highlightToday={false}
          onOpenPickNewDate={false}
          disabled={isShowingDetails}
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
          plugins={[<TimePicker key={0} position="bottom" hideSeconds />]}
          render={
            <Input
              className="date-picker-input"
              onChange={handleChange}
              readOnly
              placeholder="DD/MM/YYYY - HH:MM"
            />
          }
          onChange={timeChange}
          value={startDate}
          minDate={minDate}
          className="rmdp-mobile  animate-fadeIn"
        />
        <div
          onClick={() => handleSetAsap()}
          className="flex items-center justify-center w-[43px] h-[22px] border border-gray80 bg-gray60 text-gray80 rounded-md cursor-pointer px-2 mr-3 font-semibold text-2xs">
          ASAP
        </div>
      </div>
      {showErrors && showErrors.startDateStatus == false && (
        <p className="text-error text-2xs m-0 mt-[2px] p-0 absolute">
          {showErrors && showErrors.statDateStatusMessage}
        </p>
      )}
    </div>
  );
};

export default StartDateComp;
