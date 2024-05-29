"use client";

import { useEffect, useState } from "react";

import { diffToNextMonth } from "@/utils/time";

const Timer = () => {
  const [now, setNow] = useState(new Date());
  const [days, setDays] = useState("00");
  const [hours, setHours] = useState("00");
  const [minutes, setMinutes] = useState("00");
  const [seconds, setSeconds] = useState("00");

  useEffect(() => {
    const diff = diffToNextMonth(now);
    setSeconds(diff.seconds);
    setMinutes(diff.minutes);
    setHours(diff.hours);
    setDays(diff.days);
  }, [now]);

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="relative flex flex-col items-center rounded-b-2xl bg-bg03 px-5 py-2 md:absolute md:left-1/2 md:top-0 md:-translate-x-1/2">
      <p className="mb-1.5 text-xs text-txt2">This Month ends in:</p>
      <span className="relative h-7 w-52 text-center">
        <p className="text-center font-digital-numbers text-xl text-txt1">
          {days}:{hours}:{minutes}:{seconds}
        </p>
      </span>
    </div>
  );
};

export default Timer;
