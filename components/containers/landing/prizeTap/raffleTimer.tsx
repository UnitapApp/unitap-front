"use client";

import { useState, useMemo, useEffect } from "react";

type RaffleCardTimerProps = {
  startTime: string;
  FinishTime: string;
};

export const RaffleCardTimerLandingPage = ({
  startTime,
  FinishTime,
}: RaffleCardTimerProps) => {
  const [now, setNow] = useState(new Date());
  const [days, setDays] = useState("00");
  const [hours, setHours] = useState("00");
  const [minutes, setMinutes] = useState("00");
  const [seconds, setSeconds] = useState("00");

  let startTimeDate = useMemo(() => new Date(startTime), [startTime]);
  let FinishTimeDate = useMemo(() => new Date(FinishTime), [FinishTime]);

  let deadline = useMemo(
    () =>
      startTimeDate.getTime() > now.getTime() ? startTimeDate : FinishTimeDate,
    [startTimeDate, FinishTimeDate, now]
  );

  useEffect(() => {
    const diff = deadline.getTime() - now.getTime();
    if (diff <= 0) {
      return;
    }
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
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
    <div className="prize-card__timer flex gap-1 md:px-1 mt-[-2px] text-gray100 items-center">
      <div className="prize-card__timer-item flex flex-col justify-between items-center text-2xs">
        <p className="prize-card__timer-item-value font-semibold">{days}</p>
      </div>
      <p className="text-sm">:</p>
      <div className="prize-card__timer-item flex flex-col justify-between items-center text-2xs">
        <p className="prize-card__timer-item-value font-semibold">{hours}</p>
      </div>
      <p className="text-sm">:</p>
      <div className="prize-card__timer-item flex flex-col justify-between items-center text-2xs">
        <p className="prize-card__timer-item-value font-semibold">{minutes}</p>
      </div>
      <p className="text-sm">:</p>
      <div className="prize-card__timer-item flex flex-col justify-between items-center text-2xs">
        <p className="prize-card__timer-item-value font-semibold">{seconds}</p>
      </div>
    </div>
  );
};
