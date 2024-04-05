"use client";

import { useState } from "react";

const baseUnitTime = 1000; // ms

const FPS = 60;

export const useNumberLinearInterpolate = ({
  initial,
  duration,
}: {
  initial: number;
  duration: number;
}) => {
  const [number, setNumber] = useState(initial);

  const onChange = (value: number) => {
    const frames = (duration * FPS) / baseUnitTime;

    const increment = (value - number) / frames;

    let currentNumber = number;
    const interval = setInterval(() => {
      currentNumber += increment;
      setNumber(Math.floor(currentNumber));
      if (Math.abs(currentNumber - value) < Math.abs(increment)) {
        clearInterval(interval);
        setNumber(value);
      }
    }, baseUnitTime / FPS);
  };

  return {
    value: number,
    onChange,
  };
};
