"use client";

import { useEffect, useState } from "react";

import { diffToNextMonday, diffToNextMonth } from "@/utils/time";

const Timer = () => {
  const [now, setNow] = useState(new Date());
  const [days, setDays] = useState("00");
  const [hours, setHours] = useState("00");
  const [minutes, setMinutes] = useState("00");
  const [seconds, setSeconds] = useState("00");

  useEffect(() => {
    const diff = diffToNextMonday(now);
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
    <div className="flex relative flex-col -translate-x-1/2 items-center ml-auto bg-[#11111F] py-2 px-5 rounded-b-2xl">
      <p className="text-gray100 text-xs mb-1.5">This Month ends in:</p>
      <span className="relative w-52 h-7 text-center">
        <p className="font-digital-numbers text-[#A3BFC8] text-xl text-center">
          {days}:{hours}:{minutes}:{seconds}
        </p>
      </span>
    </div>
  );
};

export default Timer;
