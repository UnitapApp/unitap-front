"use client";

import { ErrorProps } from "@/types";
import DatePicker, { DateObject } from "react-multi-date-picker";
import TimePicker from "react-multi-date-picker/plugins/time_picker";
import { useEffect, useState, useRef } from "react";
import styled from "styled-components";
import { useTokenTapFromContext } from "@/context/providerDashboardTokenTapContext";
import "react-multi-date-picker/styles/layouts/mobile.css";
const Input = styled.input``;

interface StartDateCompProp {
  showErrors: ErrorProps | null;
}

const StartDateComp = ({ showErrors }: StartDateCompProp) => {
  const { data, handleSetDate, isShowingDetails } = useTokenTapFromContext();
  const [startDate, setStartDate] = useState<any>();
  const [minDate, setMinDate] = useState<any>();

  useEffect(() => {
    if (data.startTimeStamp) {
      setStartDate(data.startTimeStamp * 1000);
    }
    setMinDate(Date.now() - 10 * 60 * 1000);

    // setMinDate(Date.now() + 7 * 24 * 60 * 59 * 1000);
  }, []);

  const handleChange = () => {};

  const timeChange = (e: any) => {
    if (e?.unix) {
      handleSetDate(
        Math.round(new Date(e.unix * 1000).setSeconds(0) / 1000),
        "startTime",
      );
    }
    setStartDate(e);
  };

  const handleSetAsap = () => {
    if (isShowingDetails) return;
    const currentTimestamp = Math.floor(Date.now() / 60000) * 60;
    handleSetDate(currentTimestamp + 5 * 60, "startTime");
    setStartDate(new Date().getTime() + 5 * 60 * 1000);
  };

  return (
    <div className="relative w-full">
      <div
        className={`flex border bg-gray40 text-xs ${
          showErrors && showErrors.startDateStatus == false
            ? "border-error"
            : "border-gray50"
        } h-[43px] w-full max-w-[452px] items-center overflow-hidden rounded-xl`}
      >
        <p className="flex h-full w-full max-w-[148px] items-center justify-center bg-gray30 text-xs text-gray100">
          Start Date & Time
        </p>
        <DatePicker
          currentDate={
            new DateObject({ date: new Date().getTime() + 5 * 60 * 1000 })
          }
          disabled={isShowingDetails}
          highlightToday={false}
          onOpenPickNewDate={false}
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
          className="mr-3 flex h-[22px] w-[43px] cursor-pointer items-center justify-center rounded-md border border-gray80 bg-gray60 px-2 text-2xs font-semibold text-gray80"
        >
          ASAP
        </div>
      </div>
      {showErrors && showErrors.startDateStatus == false && (
        <p className="absolute m-0 mt-[2px] p-0 text-2xs text-error">
          {showErrors && showErrors.statDateStatusMessage}
        </p>
      )}
    </div>
  );
};

export default StartDateComp;
