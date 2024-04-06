"use client";

import { useEffect, useMemo, useState } from "react";

type CompetitionCardTimerProps = {
  startTime: string;
};

const CompetitionCardTimer = ({ startTime }: CompetitionCardTimerProps) => {
  const [now, setNow] = useState(new Date());
  const [days, setDays] = useState("00");
  const [hours, setHours] = useState("00");
  const [minutes, setMinutes] = useState("00");
  const [seconds, setSeconds] = useState("00");

  const startTimeDate = useMemo(() => new Date(startTime), [startTime]);

  const deadline = useMemo(() => startTimeDate, [startTimeDate]);

  useEffect(() => {
    const diff = deadline.getTime() - now.getTime();
    if (diff <= 0) {
      setDays("00");
      setHours("00");
      setMinutes("00");
      setSeconds("00");

      return;
    }
    // time calculations for days, hours, minutes and seconds
    const newDays = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    setSeconds(seconds < 10 ? `0${seconds}` : seconds.toString());
    setMinutes(minutes < 10 ? `0${minutes}` : minutes.toString());
    setHours(hours < 10 ? `0${hours}` : hours.toString());
    setDays(newDays < 10 ? `0${newDays}` : newDays.toString());
  }, [now, deadline]);

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(new Date());
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [startTime]);

  return (
    <div className="flex items-center justify-between gap-4 rounded-xl py-2 md:px-3">
      <div className="item flex flex-col items-center justify-between text-2xs">
        <p className="item-value font-semibold text-white">{days}</p>
        <p className="item-label text-gray90">d</p>
      </div>
      <p className="text-sm text-white">:</p>
      <div className="item flex flex-col items-center justify-between text-2xs">
        <p className="item-value font-semibold text-white">{hours}</p>
        <p className="item-label text-gray90">h</p>
      </div>
      <p className="text-sm text-white">:</p>
      <div className="item flex flex-col items-center justify-between text-2xs">
        <p className="item-value font-semibold text-white">{minutes}</p>
        <p className="item-label text-gray90">m</p>
      </div>
      <p className="text-sm text-white">:</p>
      <div className="item flex flex-col items-center justify-between text-2xs">
        <p className="item-value font-semibold text-white">{seconds}</p>
        <p className="item-label text-gray90">s</p>
      </div>
    </div>
  );
};

export default CompetitionCardTimer;
