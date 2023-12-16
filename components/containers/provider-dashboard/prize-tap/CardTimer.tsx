"use client";

import { useState, useEffect, useMemo } from "react";

type RaffleCardTimerProps = {
  startTime: string;
  FinishTime: string;
};

export const ProviderDashboardCardTimer = ({
  startTime,
  FinishTime,
}: RaffleCardTimerProps) => {
  const [now, setNow] = useState(new Date());
  const [days, setDays] = useState("00");
  const [hours, setHours] = useState("00");
  const [minutes, setMinutes] = useState("00");
  const [seconds, setSeconds] = useState("00");
  const [start, setStarted] = useState<boolean>(true);

  useEffect(() => {
    setStarted(new Date(startTime) < new Date());
  }, [startTime]);

  let startTimeDate = useMemo(() => new Date(startTime), [startTime]);
  let FinishTimeDate = useMemo(
    () => new Date(start ? FinishTime : new Date()),
    [FinishTime, start]
  );

  let deadline = useMemo(
    () =>
      startTimeDate.getTime() > now.getTime() ? startTimeDate : FinishTimeDate,
    [startTimeDate, FinishTimeDate, now]
  );
  useEffect(() => {
    // calculate time difference between now and deadline
    const diff = deadline.getTime() - now.getTime();
    if (diff <= 0) {
      return;
    }

    // time calculations for days, hours, minutes and seconds
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    // set the state with the time difference
    setSeconds(seconds < 10 ? `0${seconds}` : seconds.toString());
    setMinutes(minutes < 10 ? `0${minutes}` : minutes.toString());
    setHours(hours < 10 ? `0${hours}` : hours.toString());
    setDays(days < 10 ? `0${days}` : days.toString());
  }, [now, deadline]);

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <div>
      {(start && Number(days) >= 1) || !start ? (
        <div className="prize-card__timer flex items-center justify-between rounded-xl gap-4 md:px-3 py-2 bg-gray50">
          <div className="prize-card__timer-item flex flex-col justify-between items-center text-[10px]">
            <p className="prize-card__timer-item-value text-white font-semibold">
              {days}
            </p>
            <p className="prize-card__timer-item-label text-gray90">d</p>
          </div>
          <p className="text-sm text-white">:</p>
          <div className="prize-card__timer-item flex flex-col justify-between items-center text-[10px]">
            <p className="prize-card__timer-item-value text-white font-semibold">
              {hours}
            </p>
            <p className="prize-card__timer-item-label text-gray90">h</p>
          </div>
          <p className="text-sm text-white">:</p>
          <div className="prize-card__timer-item flex flex-col justify-between items-center text-[10px]">
            <p className="prize-card__timer-item-value text-white font-semibold">
              {minutes}
            </p>
            <p className="prize-card__timer-item-label text-gray90">m</p>
          </div>
          <p className="text-sm text-white">:</p>
          <div className="prize-card__timer-item flex flex-col justify-between items-center text-[10px]">
            <p className="prize-card__timer-item-value text-white font-semibold">
              {seconds}
            </p>
            <p className="prize-card__timer-item-label text-gray90">s</p>
          </div>
        </div>
      ) : deadline.getTime() - now.getTime() > 0 ? (
        <div className="text-[10px] text-warn mt-[65px]">
          Ends in {hours} hours and {minutes} minutes and {seconds} seconds.
        </div>
      ) : null}
    </div>
  );
};
